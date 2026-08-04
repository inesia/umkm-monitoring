import { TVDashboard } from '@/components/umkm/TVDashboard';
import type { UMKMView } from '@/types/umkm';

type PageProps = {
  searchParams?: Promise<{ kiosk?: string; rotate?: string; view?: string }>;
};

export default async function Home({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const kiosk = params.kiosk !== '0';
  const autoRotate = params.rotate !== '0';
  const initialView: UMKMView =
    params.view === 'krisis' || params.view === 'program' || params.view === 'ringkasan'
      ? params.view
      : 'ringkasan';

  return (
    <TVDashboard
      kiosk={kiosk}
      autoRotate={autoRotate}
      rotateIntervalMs={75000}
      initialView={initialView}
    />
  );
}
