"use client";

import { useMemo, useRef, useState } from "react";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { LogOutIcon, Menu, X } from "lucide-react";
import { toast } from "sonner";

import { useCurrentUser } from "@/lib/session";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Logo from "./logo";
import ThemeSwitcher from "./theme-switcher";

const baseNavLinks = [
  { label: "Home", href: "/" },
  { label: "Pricing", href: "/pricing" },
];

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated } = useCurrentUser();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Build nav links dynamically so "Projects" is part of the indicator system
  const navLinks = useMemo(
    () =>
      isAuthenticated
        ? [...baseNavLinks, { label: "Projects", href: "/projects" }]
        : baseNavLinks,
    [isAuthenticated]
  );

  // Sliding indicator state
  const navRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const navContainerRef = useRef<HTMLElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });

  const handleMouseEnter = (index: number) => {
    const el = navRefs.current[index];
    const container = navContainerRef.current;
    if (el && container) {
      const elRect = el.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setIndicator({
        left: elRect.left - containerRect.left,
        width: elRect.width,
        opacity: 1,
      });
    }
  };

  const handleMouseLeave = () => {
    setIndicator((prev) => ({ ...prev, opacity: 0 }));
  };

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
      toast.success("Logged out successfully");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Failed to logout. Please try again.");
    }
  };

  return (
    <div className="sticky top-0 right-0 left-0 z-30">
      <header className="px-3 py-3 sm:px-4 sm:py-4">
        <div className="border-border/60 bg-card/80 shadow-background/20 mx-auto flex w-full max-w-6xl items-center justify-between rounded-xl border p-2.5 px-4 backdrop-blur-md">
          <Link href="/" className="shrink-0">
            <Logo />
          </Link>

          <nav
            ref={navContainerRef}
            className="relative hidden flex-1 items-center justify-center gap-1 md:flex"
            onMouseLeave={handleMouseLeave}
          >
            <div
              className="bg-primary/5 border-primary/20 pointer-events-none absolute top-1/2 h-8 -translate-y-1/2 rounded-lg border"
              style={{
                left: indicator.left,
                width: indicator.width,
                opacity: indicator.opacity,
                transition:
                  "left 0.5s cubic-bezier(0.4,0,0.2,1), width 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.35s ease",
              }}
            />

            {navLinks.map((link, i) => (
              <Link
                key={link.label}
                ref={(el) => {
                  navRefs.current[i] = el;
                }}
                href={link.href}
                onMouseEnter={() => handleMouseEnter(i)}
                className={`relative z-10 rounded-lg px-4 py-1.5 text-sm font-medium transition-colors duration-200 ${
                  pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeSwitcher />

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar className="border-primary/30 h-9 w-9 shrink-0 rounded-lg border-2 hover:cursor-pointer">
                    <AvatarImage
                      src={user?.image || undefined}
                      alt={user?.name || "User"}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary rounded-lg font-semibold">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={user?.image || undefined}
                          alt={user?.name || "User"}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary rounded-lg text-sm font-semibold">
                          {user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col overflow-hidden">
                        <span className="truncate text-sm font-semibold">
                          {user?.name || "User"}
                        </span>
                        <span className="text-muted-foreground truncate text-xs">
                          {user?.email || ""}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOutIcon className="mr-2 size-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => router.push("/signin")}
                size="sm"
                className="rounded-lg px-6 py-4.5 font-medium"
              >
                Sign in
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {mobileOpen && (
          <div className="absolute top-full right-3 left-3 z-50 mt-2 sm:right-4 sm:left-4 md:hidden">
            <div className="border-border/60 bg-card/95 mx-auto max-w-6xl rounded-xl border p-4 shadow-lg backdrop-blur-md">
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      pathname === link.href
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;
