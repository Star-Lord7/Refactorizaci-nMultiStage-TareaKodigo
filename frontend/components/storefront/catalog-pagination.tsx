import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export function CatalogPagination({ page, lastPage }: { page: number; lastPage: number }) {
  if (lastPage <= 1) return null
  return (
    <nav className="pagination" aria-label="Paginación del catálogo">
      {page > 1 ? <Link href={`/products?page=${page - 1}`}><ArrowLeft aria-hidden="true" size={15} /> Anterior</Link> : <span aria-disabled="true"><ArrowLeft aria-hidden="true" size={15} /> Anterior</span>}
      <span className="pagination-current">Página {page} de {lastPage}</span>
      {page < lastPage ? <Link href={`/products?page=${page + 1}`}>Siguiente <ArrowRight aria-hidden="true" size={15} /></Link> : <span aria-disabled="true">Siguiente <ArrowRight aria-hidden="true" size={15} /></span>}
    </nav>
  )
}
