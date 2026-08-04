import type { FunnelStep, CalendarItem, ChannelBar } from '@/types/umkm';
import { UMKMCard, SEPill, SEStatus, ChannelBars } from './UMKMCard';

export function EducationFunnel({
  funnel,
  botIntents,
  calendar,
  eduChannels,
}: {
  funnel: FunnelStep[];
  botIntents: ChannelBar[];
  calendar: CalendarItem[];
  eduChannels: ChannelBar[];
}) {
  return (
    <div className="grid grid-cols-12 gap-2.5 h-full min-h-0">
      <div className="col-span-4 min-h-0">
        <UMKMCard
          title="Funnel Blast Edukasi"
          subtitle="“Kenali Petugas Resmi UMKM” · gel. 2"
          tone="wa"
          className="h-full"
        >
          <div className="space-y-1.5">
            {funnel.map((step) => (
              <div
                key={step.label}
                className="grid grid-cols-[72px_1fr_48px] gap-2 items-center text-[0.7rem]"
              >
                <span style={{ color: 'var(--ink)' }}>{step.label}</span>
                <div
                  className="h-5 rounded-md flex items-center px-2 text-[0.58rem] font-bold text-white"
                  style={{
                    width: `${Math.max(step.pct, 12)}%`,
                    background: 'linear-gradient(90deg,#9FD9BC,#137A4C)',
                  }}
                >
                  {step.value}
                </div>
                <span className="text-right font-bold tabular-nums">{step.pct}%</span>
              </div>
            ))}
          </div>
          <div
            className="mt-3 pt-2 border-t border-dashed text-[0.68rem] leading-snug"
            style={{ borderColor: 'var(--line)', color: 'var(--ink-3)' }}
          >
            Aksi lanjut = verifikasi petugas via bot. Segmen UMKM merespons 1,8× lebih tinggi.
          </div>
        </UMKMCard>
      </div>

      <div className="col-span-4 min-h-0">
        <UMKMCard
          title="Intent & Kinerja Bot WA"
          subtitle="18.412 sesi · 24 jam"
          action={<SEPill tone="ok">Sehat</SEPill>}
          className="h-full"
        >
          <ChannelBars items={botIntents} />
        </UMKMCard>
      </div>

      <div className="col-span-4 min-h-0">
        <UMKMCard
          title="Performa Konten Edukasi"
          subtitle="Engagement rate · 7 hari"
          className="h-full"
        >
          <ChannelBars items={eduChannels} />
          <div
            className="mt-3 pt-2 border-t border-dashed text-[0.68rem] leading-snug"
            style={{ borderColor: 'var(--line)', color: 'var(--ink-3)' }}
          >
            <b style={{ color: 'var(--ink)' }}>WA Official 2–5× lebih efektif</b> dari kanal lain untuk edukasi.
          </div>
        </UMKMCard>
      </div>

      <div className="col-span-12 min-h-0">
        <UMKMCard title="Kalender Konten Edukasi" subtitle="Semua kanal · 7 hari ke depan" className="h-full">
          <table className="w-full text-[0.72rem]">
            <thead>
              <tr className="text-left text-[0.56rem] font-bold uppercase tracking-wider" style={{ color: 'var(--ink-3)' }}>
                <th className="pb-1.5 pr-2">Jadwal</th>
                <th className="pb-1.5 pr-2">Tema</th>
                <th className="pb-1.5 pr-2">Kanal</th>
                <th className="pb-1.5 pr-2">Format</th>
                <th className="pb-1.5">Status</th>
              </tr>
            </thead>
            <tbody>
              {calendar.map((row) => (
                <tr key={row.schedule} className="border-t" style={{ borderColor: 'var(--cream-2)' }}>
                  <td className="py-1.5 pr-2 font-bold whitespace-nowrap" style={{ color: 'var(--ink)' }}>
                    {row.schedule}
                  </td>
                  <td className="py-1.5 pr-2" style={{ color: 'var(--ink)' }}>
                    {row.theme}
                  </td>
                  <td className="py-1.5 pr-2" style={{ color: 'var(--ink-2)' }}>
                    {row.channel}
                  </td>
                  <td className="py-1.5 pr-2" style={{ color: 'var(--ink-3)' }}>
                    {row.format}
                  </td>
                  <td className="py-1.5">
                    <SEStatus label={row.status} tone={row.statusTone} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </UMKMCard>
      </div>
    </div>
  );
}
