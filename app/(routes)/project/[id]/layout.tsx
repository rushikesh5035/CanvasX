import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project - CanvasX",
  description: "Edit your AI-generated mobile app design project.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
