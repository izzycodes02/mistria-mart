import { notFound } from 'next/navigation';
import { adminPages } from '../_pages';

type PageProps = {
  params: Promise<{
    tables: keyof typeof adminPages; // Changed from 'table' to 'tables'
  }>;
};

export default async function AdminTablePage({ params }: PageProps) {
  const { tables } = await params; // Changed from 'table' to 'tables'

  const PageComponent = adminPages[tables]; // Changed from 'table' to 'tables'

  if (!PageComponent) notFound();

  return <PageComponent />;
}
