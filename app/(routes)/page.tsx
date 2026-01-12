import { Button } from "@/components/ui/button";
import { ArrowUpIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center gap-4">
      <Button>Button</Button>
      <Button variant="outline" size="icon" aria-label="Submit">
        <ArrowUpIcon />
      </Button>
    </div>
  );
}
