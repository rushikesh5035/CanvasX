import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Projects",
  description: "View and manage your AI-generated mobile app design projects.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
