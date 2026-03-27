import Image from "next/image";

const Logo = () => {
  return (
    <div className="flex items-center gap-1 text-2xl">
      <span className="text-card-foreground font-semibold">Canvas</span>
      <Image src={"/assets/logo.png"} alt="logo" width={25} height={25} />
    </div>
  );
};

export default Logo;
