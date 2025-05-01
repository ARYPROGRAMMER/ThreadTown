"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import React from "react";
import { Button } from "./ui/button";
import ReddishLogo from "@/images/Reddish Full.png";
import ReddishLogoOnly from "@/images/Reddish Logo Only.png";
import Image from "next/image";
import { MenuIcon } from "lucide-react";

function Header() {
  const { user } = useUser();
  return (
    <header className="
    flex items-center justify-between
    p-4 border-b border-gray-200
    ">
      {/* Left */}

      <div className="flex items-center gap-2">
        <MenuIcon className="w-6 h-6"/>
        <Image
          src={ReddishLogo}
          alt="logo"
          width={150}
          height={150}
          className="hidden md:block"
        />
        <Image
          src={ReddishLogoOnly}
          alt="logo"
          width={40}
          height={40}
          className="block md:hidden"
        />
      </div>

      <div>
        <SignedIn>
          <UserButton />
        </SignedIn>

        <SignedOut>
          <Button asChild variant={"outline"}>
            <SignInButton mode="modal" />
          </Button>
        </SignedOut>
      </div>
    </header>
  );
}

export default Header;
