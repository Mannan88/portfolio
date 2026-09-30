import { notFound } from "next/navigation"
import { PROJECTS } from "@/data/projects"
import BlogPost from "@/component/BlogPost"

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }))
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = PROJECTS.find((p) => p.slug === slug)
  if (!project) notFound()

  return (
    <BlogPost
      title={project.name}
      tagline={project.category}
      date={project.date}
      url={project.url}
      images={project.images}
      content={project.content}
    />
  )
}
