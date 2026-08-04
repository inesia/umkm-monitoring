import type { UMKMDashboardData } from '@/types/umkm';
import { UMKMKPIGrid } from '../UMKMKPIGrid';
import { EscalationPanel } from '../EscalationPanel';
import { UMKMCard, SEPill, SEStatus } from '../UMKMCard';
import { TakedownPanel } from '../Panels';

const SEV_COLOR = {
  high: 'var(--neg)',
  medium: 'var(--amber)',
  low: '#B9AC9B',
};

export function KrisisView({
  data,
  onAskAI,
}: {
  data: UMKMDashboardData;
  onAskAI?: (prompt: string) => void;
}) {
  return (
    <div className="umkm-krisis">
      <div className="area-kpi">
        <UMKMKPIGrid items={data.crisisKpis} columns={4} />
      </div>

      <div className="area-board min-h-0">
        <UMKMCard
          title="Papan Isu — Semua Isu Aktif"
          subtitle={`${data.crisisIssues.length} isu · diurutkan severity & sisa SLA`}
          action={<SEPill tone="live">Live</SEPill>}
          className="h-full"
        >
          <div className="crisis-issue-board flex flex-col h-full min-h-0 overflow-hidden">
            <div
              className="grid grid-cols-[minmax(0,2.4fr)_0.9fr_0.85fr_0.7fr_0.85fr_0.75fr] gap-1 shrink-0 pb-1 text-[0.52rem] font-bold uppercase tracking-wider"
              style={{ color: 'var(--ink-3)' }}
            >
              <span>Isu</span>
              <span>Sumber</span>
              <span>Mentions</span>
              <span>SLA</span>
              <span>PIC</span>
              <span>Status</span>
            </div>
            <div className="flex-1 min-h-0 flex flex-col gap-1 overflow-hidden">
              {data.crisisIssues.map((issue) => (
                <div
                  key={issue.title}
                  className="crisis-issue-row flex-1 min-h-0 grid grid-cols-[minmax(0,2.4fr)_0.9fr_0.85fr_0.7fr_0.85fr_0.75fr] gap-1 items-center rounded-md border px-2 py-1"
                  style={{
                    borderColor: 'var(--line)',
                    borderLeftWidth: 3,
                    borderLeftColor: SEV_COLOR[issue.severity],
                    background: '#fff',
                  }}
                >
                  <div className="min-w-0">
                    <b className="block text-[0.68rem] font-semibold leading-snug truncate" style={{ color: 'var(--ink)' }}>
                      {issue.title}
                    </b>
                    <small className="text-[0.52rem] truncate block" style={{ color: 'var(--ink-3)' }}>
                      {issue.detail}
                    </small>
                  </div>
                  <span className="text-[0.62rem] truncate" style={{ color: 'var(--ink-2)' }}>
                    {issue.source}
                  </span>
                  <span className="text-[0.62rem] tabular-nums truncate" style={{ color: 'var(--ink-2)' }}>
                    {issue.mentions}
                  </span>
                  <span
                    className="text-[0.62rem] font-bold tabular-nums"
                    style={{ color: issue.severity === 'high' ? 'var(--neg)' : 'var(--ink)' }}
                  >
                    {issue.sla}
                  </span>
                  <span className="text-[0.62rem] truncate" style={{ color: 'var(--ink-2)' }}>
                    {issue.pic}
                  </span>
                  <div className="min-w-0">
                    <SEStatus label={issue.status} tone={issue.statusTone} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </UMKMCard>
      </div>

      <div className="area-esc">
        <EscalationPanel
          data={data.escalation}
          variant="krisis"
          onAskAI={onAskAI}
        />
      </div>

      <div className="area-tl min-h-0">
        <UMKMCard
          title="Kronologi Krisis — Hoaks Pajak"
          subtitle={`${data.escalation.id} · dimulai 6 Juli 19.02 WIB`}
          className="h-full"
        >
          <div className="relative pl-4 h-full min-h-0 flex flex-col justify-evenly gap-1 overflow-hidden py-0.5">
            <span
              className="absolute left-[5px] top-2 bottom-2 w-0.5"
              style={{ background: 'var(--line-2)' }}
            />
            {data.crisisTimeline.map((ev) => (
              <div key={ev.time} className="relative shrink-0 py-1">
                <span
                  className="absolute -left-4 top-2 w-2 h-2 rounded-full border-2 border-white"
                  style={{
                    background:
                      ev.tone === 'crit'
                        ? 'var(--neg)'
                        : ev.tone === 'good'
                          ? 'var(--pos)'
                          : 'var(--orange)',
                    boxShadow: '0 0 0 1.5px var(--line-2)',
                  }}
                />
                <div className="text-[0.56rem] font-bold tracking-wide" style={{ color: 'var(--ink-3)' }}>
                  {ev.time}
                </div>
                <div className="text-[0.68rem] leading-snug mt-0.5" style={{ color: 'var(--ink)' }}>
                  {ev.text}
                </div>
              </div>
            ))}
          </div>
        </UMKMCard>
      </div>

      <div className="area-take">
        <TakedownPanel data={data.takedown} variant="krisis" />
      </div>

      <div className="area-mx">
        <UMKMCard title="Matriks Severity & SLA" className="h-full">
          <div className="space-y-2">
            <div
              className="rounded-lg border p-2.5 text-[0.66rem] leading-snug border-l-[3px]"
              style={{ borderColor: 'var(--line)', borderLeftColor: 'var(--neg)' }}
            >
              <b className="block text-[0.72rem] mb-0.5" style={{ color: 'var(--ink)' }}>
                Tinggi — ≤ 4 jam
              </b>
              Hoaks masif / reach &gt; 10 jt. Wajib L2, opsi L3.
            </div>
            <div
              className="rounded-lg border p-2.5 text-[0.66rem] leading-snug border-l-[3px]"
              style={{ borderColor: 'var(--line)', borderLeftColor: 'var(--amber)' }}
            >
              <b className="block text-[0.72rem] mb-0.5" style={{ color: 'var(--ink)' }}>
                Sedang — ≤ 12 jam
              </b>
              Isu regional / penipuan lokal / reach 1–10 jt.
            </div>
            <div
              className="rounded-lg border p-2.5 text-[0.66rem] leading-snug border-l-[3px]"
              style={{ borderColor: 'var(--line)', borderLeftColor: '#B9AC9B' }}
            >
              <b className="block text-[0.72rem] mb-0.5" style={{ color: 'var(--ink)' }}>
                Rendah — ≤ 24 jam
              </b>
              Keluhan sporadis. FAQ, WA Official & edukasi.
            </div>
          </div>
        </UMKMCard>
      </div>
    </div>
  );
}
