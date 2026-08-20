import { HomeView } from "@/components/home/home-view"
import { getHomeHero, getHomeProjects, getPublicProducts } from "@/lib/content/store"

export const dynamic = "force-dynamic"

export default async function Home() {
  const [products, projects, hero] = await Promise.all([
    getPublicProducts(),
    getHomeProjects(),
    getHomeHero(),
  ])
  return <HomeView products={products} projects={projects} hero={hero} />
}
