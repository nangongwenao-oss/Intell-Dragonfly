export interface TargetConfig {
  domain: string;
  ipRange: string;
  techStack: string[];
  mode: 'passive' | 'deep';
}

export interface AttackNode {
  id: string;
  label: string;
  type: 'entry' | 'vuln' | 'system' | 'target';
  x: number;
  y: number;
  riskScore: number;
}

export interface AttackLink {
  source: string;
  target: string;
  method: string;
}

export interface AttackGraphData {
  nodes: AttackNode[];
  links: AttackLink[];
  totalRiskScore: number;
  pathCount: number;
  criticalCve: string;
}

export interface Vulnerability {
  id: string;
  cveId: string;
  name: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  mitigation: string[];
  compliance: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum AppRoute {
  LOGIN = 'login',
  CONFIG = 'config',
  ATTACK_SURFACE = 'attack_surface',
  DEFENSE = 'defense',
  CHAT = 'chat'
}
