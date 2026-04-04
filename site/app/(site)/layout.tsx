import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteNav />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
