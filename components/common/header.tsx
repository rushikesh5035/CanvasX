"use client";

import { useTheme } from "next-themes";
import Logo from "./logo";
import Link from "next/link";
import { Button } from "../ui/button";
import { LogOutIcon, MoonIcon, SunIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import ThemeSwitcher from "./theme-switcher";

const Header = () => {
  const { user } = useKindeBrowserClient();

  return (
    <div className="sticky top-0 right-0 left-0 z-30">
      <header className="h-16 border-b bg-background py-4">
        <div
          className="w-full max-w-6xl mx-auto
         flex items-center justify-between"
        >
          <Logo />
          <div
            className="hidden flex-1 items-center
          justify-center gap-8 md:flex"
          >
            <Link href="/" className="text-foreground-muted text-sm">
              Home
            </Link>
            <Link href="/" className="text-foreground-muted text-sm">
              Pricing
            </Link>
          </div>
          <div
            className="flex flex-1 items-center
           justify-end gap-3"
          >
            <ThemeSwitcher />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar className="h-9 w-9 shrink-0 rounded-full hover:cursor-pointer">
                    <AvatarImage
                      src={user?.picture || ""}
                      alt={user?.given_name || ""}
                    />
                    <AvatarFallback className="rounded-lg">
                      {user?.given_name?.charAt(0)}
                      {user?.family_name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogoutLink className="w-full flex items-center">
                      <LogOutIcon className="size-4" />
                      Logout
                    </LogoutLink>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <LoginLink>
                <Button>Sign in</Button>
              </LoginLink>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
