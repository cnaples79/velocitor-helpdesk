import { Metadata } from 'next';
import { Suspense } from 'react';
import Loading from './loading';

type TicketsLayoutProps = {
  children: React.ReactNode;
};

export const metadata: Metadata = {
  title: 'Users | Velocitor Helpdesk',
  description: 'The main Users page of Velocitor Helpdesk.',
};

export default function TicketsLayout({ children }: TicketsLayoutProps) {
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
}
