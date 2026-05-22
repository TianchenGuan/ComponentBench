import { redirect } from 'next/navigation';
import { hasAnyRuns } from '@/lib/logLocalBackend';
import HomeClient from './_HomeClient';

export const dynamic = 'force-dynamic';

type SearchParamsShape = Record<string, string | string[] | undefined>;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParamsShape>;
}) {
  const params = await searchParams;
  // First-load default: if any runs exist on disk, land in logs view.
  // If the user already passed mode/bench/anything, respect it.
  if (Object.keys(params).length === 0 && hasAnyRuns()) {
    redirect('/?mode=log&bench=v1');
  }
  return <HomeClient />;
}
