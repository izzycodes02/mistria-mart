import { notFound } from 'next/navigation';
import { adminPages } from '../../_pages';

type PageProps = {
  params: {
    tables: keyof typeof adminPages;
  };
};

export default function AdminTablePage({ params }: PageProps) {
  const PageComponent = adminPages[params.tables];

  if (!PageComponent) {
    notFound();
  }

  return <PageComponent />;
}
