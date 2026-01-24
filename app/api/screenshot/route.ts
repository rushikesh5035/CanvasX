import prisma from "@/lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

let cachedExecutablePath: string | null = null;
let downloadPromise: Promise<string> | null = null;

async function getChromiumPath(): Promise<string> {
  if (cachedExecutablePath) return cachedExecutablePath;

  if (!downloadPromise) {
    const chromium = (await import("@sparticuz/chromium-min")).default;
    downloadPromise = chromium
      .executablePath(
        "https://github.com/gabenunez/puppeteer-on-vercel/raw/refs/heads/main/example/chromium-dont-use-in-prod.tar",
      )
      .then((path) => {
        cachedExecutablePath = path;
        console.log("Chromium path resolved:", path);
        return path;
      })
      .catch((error) => {
        console.error("Failed to get Chromium path:", error);
        downloadPromise = null;
        throw error;
      });
  }

  return downloadPromise;
}

export async function POST(request: Request) {
  let browser;

  try {
    const { html, width = 800, height = 600, projectId } = await request.json();

    const session = await getKindeServerSession();
    const user = await session?.getUser();

    if (!user) throw new Error("Unauthorized");

    const userId = user.id;

    // Detect environment
    const isProduction = process.env.NODE_ENV === "production";
    const isVercel = !!process.env.VERCEL;

    let puppeteer;
    let launchOptions: {
      headless: boolean;
      args?: string[];
      executablePath?: string;
    } = {
      headless: true,
    };

    if (isProduction && isVercel) {
      const chromium = (await import("@sparticuz/chromium-min")).default;
      puppeteer = await import("puppeteer-core");

      const executablePath = await getChromiumPath();

      launchOptions = {
        ...launchOptions,
        args: chromium.args,
        executablePath: executablePath,
      };
    } else {
      puppeteer = await import("puppeteer");
    }

    browser = await puppeteer.launch(launchOptions);

    const page = await browser.newPage();

    // set view port side
    await page.setViewport({
      width: Number(width),
      height: Number(height),
      deviceScaleFactor: 2,
    });

    // set HTML content
    await page.setContent(html, {
      waitUntil: "domcontentloaded",
    });

    // give some time to load all resources
    await new Promise((resolve) => setTimeout(resolve, 500));

    // take screenshot
    const buffer = await page.screenshot({
      type: "png",
      fullPage: false,
    });

    if (projectId) {
      const base64 = Buffer.from(buffer).toString("base64");
      await prisma.project.update({
        where: {
          id: projectId,
          userId: userId,
        },
        data: {
          thumbnail: `data:image/png;base64,${base64}`,
        },
      });

      return NextResponse.json({
        base64,
      });
    }

    return new NextResponse(Buffer.from(buffer), {
      headers: {
        "Content-Type": "image/png",
      },
    });
  } catch (error) {
    console.error("Error generating screenshot:", error);
    return NextResponse.json(
      { error: "Failed to generate screenshot" },
      { status: 500 },
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
