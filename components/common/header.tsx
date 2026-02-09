"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { LogOutIcon } from "lucide-react";
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

const Header = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useCurrentUser();

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
      <header className="bg-background h-16 border-b py-4">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
          <Logo />
          <div className="hidden flex-1 items-center justify-center gap-8 md:flex">
            <Link href="/" className="text-foreground-muted text-sm">
              Home
            </Link>

            <Link href="/" className="text-foreground-muted text-sm">
              Pricing
            </Link>
            {isAuthenticated && (
              <Link href="/projects" className="text-foreground-muted text-sm">
                Projects
              </Link>
            )}
          </div>
          <div className="flex flex-1 items-center justify-end gap-3">
            <ThemeSwitcher />
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar className="h-9 w-9 shrink-0 rounded-full hover:cursor-pointer">
                    <AvatarImage
                      src={user?.image || ""}
                      alt={user?.name || ""}
                    />
                    <AvatarFallback className="rounded-lg">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOutIcon className="mr-2 size-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => router.push("/signin")}>Sign in</Button>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
