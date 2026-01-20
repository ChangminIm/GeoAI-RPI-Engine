
export interface RPIMetrics {
  emo: number; // X_emo: 정서적 애착
  spa: number; // X_spa: 공간적 점유
  soc: number; // X_soc: 사회적 교류
}

export interface RPIWeights {
  alpha: number; // weight for emo
  beta: number;  // weight for spa
  gamma: number; // weight for soc
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

// Factor interface required for AttentionChart component
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