
export interface RPIMetrics {
  emo: number; // 정서적 애착
  spa: number; // 공간적 점유
  soc: number; // 사회적 교류
}

export interface RPIWeights {
  alpha: number; // 정서적 애착 가중치
  beta: number;  // 공간적 점유 가중치
  gamma: number; // 사회적 교류 가중치
}

export interface TrajectoryPoint {
  period: string;
  score: number;
}

export interface KnowledgeNode {
  id: string;
  label: string;
  type: 'Place' | 'Activity' | 'Interaction';
}

export interface KnowledgeEdge {
  source: string;
  target: string;
  strength: number;
}

// Factor interface added to satisfy requirements of the AttentionChart component
export interface Factor {
  name: string;
  weight: number;
  category: string;
}

export interface AnalysisResult {
  metrics: RPIMetrics;
  weights: RPIWeights;
  rpiScore: number;
  summary: string;
  trajectory: TrajectoryPoint[];
  knowledgeGraph: {
    nodes: KnowledgeNode[];
    edges: KnowledgeEdge[];
  };
  criticalPeriod: string;
  shapValue: { [key: string]: number };
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  text: string;
  result: AnalysisResult;
}
