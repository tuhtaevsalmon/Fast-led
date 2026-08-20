import { HomeView } from "@/components/home/home-view"
import { getHomeProjects, getPublicProducts } from "@/lib/content/store"

export const dynamic = "force-dynamic"

export default async function Home() {
  const [products, projects] = await Promise.all([getPublicProducts(), getHomeProjects()])
  return <HomeView products={products} projects={projects} />
}
