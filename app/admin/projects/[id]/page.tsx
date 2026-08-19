import { notFound } from "next/navigation"
import { getPublicProjects } from "@/lib/content/store"
import { DeleteProjectButton } from "./delete-button"
import { ProjectForm } from "../project-form"

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const project = (await getPublicProjects()).find((p) => p.id === id)
  if (!project) notFound()
  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">{project.title}</h1>
        <DeleteProjectButton id={project.id} />
      </div>
      <ProjectForm project={project} />
    </div>
  )
}
