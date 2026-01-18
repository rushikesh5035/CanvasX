import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link href="/" className="flex-1 flex items-center gap-1 text-2xl">
      <span className="font-semibold text-foreground">Canvas</span>
      {/* <span className="inline-block font-extrabold text-primary">X</span> */}
      <Image src={"/assets/logo.png"} alt="logo" width={25} height={25} />
    </Link>
  );
};

export default Logo;
