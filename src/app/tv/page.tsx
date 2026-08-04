import { TVDashboard } from '@/components/umkm/TVDashboard';
import type { UMKMView } from '@/types/umkm';

export const metadata = {
  title: 'UMKM Engagement Center — TV Monitor',
  description: 'Fullscreen TV dashboard for Kementerian UMKM Engagement Center',
};

type PageProps = {
  searchParams?: Promise<{ kiosk?: string; rotate?: string; view?: string }>;
};

const VALID_VIEWS: UMKMView[] = ['menteri', 'program', 'krisis'];

export default async function TVPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const kiosk = params.kiosk !== '0';
  const autoRotate = params.rotate !== '0';
  const raw = params.view === 'ringkasan' ? 'menteri' : params.view;
  const initialView: UMKMView =
    raw && VALID_VIEWS.includes(raw as UMKMView) ? (raw as UMKMView) : 'menteri';

  return (
    <TVDashboard
      kiosk={kiosk}
      autoRotate={autoRotate}
      rotateIntervalMs={75000}
      initialView={initialView}
    />
  );
}
