import { redirect } from "next/navigation"
import { getPublicProjects } from "@/lib/content/store"
import { ProjectForm } from "../project-form"

export default async function NewProjectPage() {
  const projects = await getPublicProjects()
  if (projects.length >= 3) redirect("/admin/projects")
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Новый проект</h1>
      <ProjectForm />
    </div>
  )
}
