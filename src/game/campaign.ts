export interface StageInfo {
  id: number;
  name: string;
  group: 'C2' | 'V4' | 'D4';
  scrambleMoves: number;
  targetStars: { three: number; two: number };
}

export const STAGES: StageInfo[] = [
  { id: 1, name: '1단계: C₂ 1수 입문', group: 'C2', scrambleMoves: 1, targetStars: { three: 1, two: 2 } },
  { id: 2, name: '2단계: C₂ 2수 연습', group: 'C2', scrambleMoves: 2, targetStars: { three: 2, two: 3 } },
  { id: 3, name: '3단계: C₂ 3수 기초', group: 'C2', scrambleMoves: 3, targetStars: { three: 3, two: 5 } },
  { id: 4, name: '4단계: V₄ 2수 반전', group: 'V4', scrambleMoves: 2, targetStars: { three: 2, two: 3 } },
  { id: 5, name: '5단계: V₄ 3수 응용', group: 'V4', scrambleMoves: 3, targetStars: { three: 3, two: 5 } },
  { id: 6, name: '6단계: V₄ 4수 마스터', group: 'V4', scrambleMoves: 4, targetStars: { three: 4, two: 6 } },
  { id: 7, name: '7단계: D₄ 2수 회전', group: 'D4', scrambleMoves: 2, targetStars: { three: 2, two: 3 } },
  { id: 8, name: '8단계: D₄ 3수 대각', group: 'D4', scrambleMoves: 3, targetStars: { three: 3, two: 5 } },
  { id: 9, name: '9단계: D₄ 4수 중급', group: 'D4', scrambleMoves: 4, targetStars: { three: 4, two: 6 } },
  { id: 10, name: '10단계: D₄ 5수 고급', group: 'D4', scrambleMoves: 5, targetStars: { three: 5, two: 7 } },
  { id: 11, name: '11단계: D₄ 6수 마스터', group: 'D4', scrambleMoves: 6, targetStars: { three: 6, two: 8 } },
  { id: 12, name: '12단계: D₄ 7수 신의 영역', group: 'D4', scrambleMoves: 7, targetStars: { three: 7, two: 9 } },
];

export interface StageProgress {
  unlocked: boolean;
  bestMoves: number | null;
  stars: number;
}

const STORAGE_KEY = 'matrix_cube_campaign_progress_v1';

export class CampaignManager {
  private progress: Record<number, StageProgress> = {};

  constructor() {
    this.loadProgress();
  }

  public loadProgress() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        this.progress = JSON.parse(raw);
      } catch {
        this.progress = {};
      }
    }
    // 1단계는 기본 언락
    if (!this.progress[1]) {
      this.progress[1] = { unlocked: true, bestMoves: null, stars: 0 };
    }
  }

  public saveProgress() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.progress));
  }

  public getStageProgress(stageId: number): StageProgress {
    return this.progress[stageId] || { unlocked: false, bestMoves: null, stars: 0 };
  }

  public completeStage(stageId: number, moves: number): number {
    const stage = STAGES.find(s => s.id === stageId);
    if (!stage) return 0;

    let earnedStars = 1;
    if (moves <= stage.targetStars.three) earnedStars = 3;
    else if (moves <= stage.targetStars.two) earnedStars = 2;

    const cur = this.getStageProgress(stageId);
    const newBest = cur.bestMoves === null ? moves : Math.min(cur.bestMoves, moves);
    const newStars = Math.max(cur.stars, earnedStars);

    this.progress[stageId] = {
      unlocked: true,
      bestMoves: newBest,
      stars: newStars
    };

    // 다음 스테이지 언락
    if (stageId + 1 <= STAGES.length) {
      const next = this.getStageProgress(stageId + 1);
      this.progress[stageId + 1] = {
        ...next,
        unlocked: true
      };
    }

    this.saveProgress();
    return earnedStars;
  }

  public getTotalStars(): number {
    return Object.values(this.progress).reduce((sum, p) => sum + (p.stars || 0), 0);
  }
}

export const campaignManager = new CampaignManager();
