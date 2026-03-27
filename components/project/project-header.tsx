import { useRouter } from "next/navigation";

import { ArrowLeftIcon } from "lucide-react";

import Logo from "../common/logo";
import ThemeSwitcher from "../common/theme-switcher";
import { Button } from "../ui/button";

const ProjectHeader = ({ projectName }: { projectName?: string }) => {
  const router = useRouter();

  return (
    <div className="sticky top-0">
      <header className="border-border/40 border-b backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-4">
            <Logo />
            <Button
              size="icon-sm"
              variant="ghost"
              className="bg-muted! rounded-full hover:cursor-pointer"
              onClick={() => router.push("/")}
            >
              <ArrowLeftIcon className="size-4" />
            </Button>
            <p className="max-w-50 truncate font-medium">
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
