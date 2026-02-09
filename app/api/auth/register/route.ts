import { NextResponse } from "next/server";

import bcrypt from "bcryptjs";
import z from "zod";

import prisma from "@/lib/prisma";
import { checkRateLimit, registrationLimiter } from "@/lib/rate-limit";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    // const { name, email, password } = await request.json();

    const body = await request.json();
    const { email, password, name } = registerSchema.parse(body);

    // Check rate limit by email to prevent spam registrations
    const limit = await checkRateLimit(email, registrationLimiter);
    if (!limit.allowed) {
      return NextResponse.json(
        {
          error: "Too many registration attempts. Please try again later.",
          retryAfter: limit.retryAfter,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.limit.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": limit.resetAt.getTime().toString(),
            "Retry-After": limit.retryAfter.toString(),
          },
        }
      );
    }

    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        message: "User created",
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
