import React from "react";

import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/" className="flex flex-1 items-center gap-1 text-2xl">
      <span className="text-foreground font-semibold">Canvas</span>
      {/* <span className="inline-block font-extrabold text-primary">X</span> */}
      <Image src={"/assets/logo.png"} alt="logo" width={25} height={25} />
    </Link>
  );
};

export default Logo;
