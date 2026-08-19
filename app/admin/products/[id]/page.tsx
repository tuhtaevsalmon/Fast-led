import { notFound } from "next/navigation"
import { getAllProducts } from "@/lib/content/store"
import { DeleteProductButton } from "./delete-button"
import { ProductForm } from "../product-form"

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = (await getAllProducts()).find((p) => p.id === id)
  if (!product) notFound()
  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">{product.name}</h1>
        <DeleteProductButton id={product.id} />
      </div>
      <ProductForm product={product} />
    </div>
  )
}
