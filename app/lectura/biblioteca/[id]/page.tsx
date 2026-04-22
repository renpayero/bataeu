import BookDetail from '@/components/lectura/BookDetail'

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const bookId = parseInt(id, 10)
  return <BookDetail bookId={bookId} />
}
