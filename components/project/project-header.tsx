import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

const ProjectHeader = ({ projectName }: { projectName?: string }) => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="sticky top-0">
      <header className="border-b border-border/40"></header>
    </div>
  );
};

export default ProjectHeader;
