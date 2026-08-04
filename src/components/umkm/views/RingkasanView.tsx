import type { UMKMDashboardData } from '@/types/umkm';
import { UMKMKPIProgressTicker } from '../UMKMKPIProgressTicker';
import { NationalIssueMap } from '../NationalIssueMap';
import { EscalationPanel } from '../EscalationPanel';
import {
  DigitalArmyPanel,
  TakedownPanel,
  WAOfficialPanel,
  SentimentPanel,
  TimelinePanel,
  KeywordsPanel,
} from '../Panels';

type RingkasanViewProps = {
  data: UMKMDashboardData;
  onOpenWarRoom?: () => void;
  onAskAI?: (prompt: string) => void;
};

export function RingkasanView({ data, onOpenWarRoom, onAskAI }: RingkasanViewProps) {
  return (
    <div className="umkm-ringkasan w-full h-full min-h-0">
      <div className="area-kpi">
        <UMKMKPIProgressTicker items={data.kpis} />
      </div>

      <div className="area-timeline min-h-0">
        <TimelinePanel channels={data.channels} insight={data.insight} />
      </div>
      <div className="area-senti min-h-0">
        <SentimentPanel sentiment={data.sentiment} emotions={data.emotions} />
      </div>
      <div className="area-esc min-h-0">
        <EscalationPanel
          data={data.escalation}
          variant="ringkasan"
          onOpenWarRoom={onOpenWarRoom}
          onAskAI={onAskAI}
        />
      </div>

      <div className="area-map min-h-0">
        <NationalIssueMap bubbles={data.mapBubbles} top={data.mapTop} />
      </div>

      <div className="area-army min-h-0">
        <DigitalArmyPanel data={data.digitalArmy} />
      </div>
      <div className="area-take min-h-0">
        <TakedownPanel data={data.takedown} variant="ringkasan" />
      </div>
      <div className="area-wa min-h-0">
        <WAOfficialPanel data={data.wa} />
      </div>
      <div className="area-kw min-h-0">
        <KeywordsPanel keywords={data.keywords} posts={data.posts} />
      </div>
    </div>
  );
}
