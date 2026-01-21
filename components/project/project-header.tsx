import { useRouter } from "next/navigation";
import Logo from "../common/logo";
import { Button } from "../ui/button";
import { ArrowLeftIcon } from "lucide-react";
import ThemeSwitcher from "../common/theme-switcher";

const ProjectHeader = ({ projectName }: { projectName?: string }) => {
  const router = useRouter();

  return (
    <div className="sticky top-0">
      <header
        className="border-b border-border/40
    bg-card/50 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-4">
            <Logo />
            <Button
              size="icon-sm"
              variant="ghost"
              className="rounded-full bg-muted! hover:cursor-pointer"
              onClick={() => router.push("/")}
            >
              <ArrowLeftIcon className="size-4" />
            </Button>
            <p className="max-w-[200px] truncate font-medium">
              {projectName || "Untitled Project"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ThemeSwitcher />
          </div>
        </div>
      </header>
    </div>
  );
};

export default ProjectHeader;
