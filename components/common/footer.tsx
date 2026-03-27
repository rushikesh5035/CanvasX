import Link from "next/link";

import { Github, Twitter } from "lucide-react";

import Logo from "./logo";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Pricing", href: "/" },
];

const Footer = () => {
  return (
    <footer className="border-border/30 relative mt-4 border-t">
      <div className="mx-auto max-w-6xl px-4 pt-8 pb-4 sm:px-6 sm:pt-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <Logo />
          <p className="text-muted-foreground max-w-md text-sm leading-relaxed font-medium">
            Go from idea to beautiful mobile app mockups in minutes — powered by
            AI.
          </p>
          <ul className="mt-2 flex gap-6">
            {footerLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-muted-foreground hover:text-primary text-sm transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-center gap-3">
            <Link
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="border-border/40 bg-card/40 text-muted-foreground hover:text-primary hover:border-primary/30 flex h-8 w-8 items-center justify-center rounded-lg border transition-all"
            >
              <Github className="h-4 w-4" />
            </Link>
            <Link
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="border-border/40 bg-card/40 text-muted-foreground hover:text-primary hover:border-primary/30 flex h-8 w-8 items-center justify-center rounded-lg border transition-all"
            >
              <Twitter className="h-4 w-4" />
            </Link>
          </div>
          {/* Link columns */}
          {/* <div className="mt-2">
            {Object.entries(footerLinks).map(([group, links]) => (
              <div key={group} className="flex flex-col gap-3">
                <ul className="flex gap-6">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="border-border/60 bg-background/40 text-muted-foreground hover:border-border hover:text-foreground flex h-8 w-8 items-center justify-center rounded-md border transition-colors"
            >
              <Github className="h-4 w-4" />
            </Link>
            <Link
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="border-border/60 bg-background/40 text-muted-foreground hover:border-border hover:text-foreground flex h-8 w-8 items-center justify-center rounded-md border transition-colors"
            >
              <Twitter className="h-4 w-4" />
            </Link>
          </div> */}
        </div>

        <div className="border-border/20 mt-6 flex flex-col items-center justify-between gap-3 border-t pt-4 sm:flex-row">
          <p className="text-muted-foreground/70 text-xs">
            © {new Date().getFullYear()} CanvasX. All rights reserved.
          </p>
          <p className="text-muted-foreground/70 text-xs">
            Developed by{" "}
            <a
              href="https://rushikesh-dev.xyz/"
              className="text-primary font-medium hover:underline"
            >
              Rushikesh
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
