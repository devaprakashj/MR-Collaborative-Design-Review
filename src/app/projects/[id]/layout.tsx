import { INITIAL_PROJECTS } from "@/lib/mockData";

export function generateStaticParams() {
  return INITIAL_PROJECTS.map((project) => ({
    id: project.id,
  }));
}

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

