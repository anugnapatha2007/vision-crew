export type STEMField = "physics" | "mathematics" | "chemistry" | "engineering" | "technology";

export interface Variable {
  symbol: string;
  description: string;
  unit: string;
}

export interface Formula {
  name: string;
  latex: string;
  variables: Variable[];
}

export interface SolutionStep {
  stepNumber: number;
  title: string;
  explanation: string;
  formula?: string;
  result?: string;
}

export interface DiagramElement {
  type: string;
  x?: number;
  y?: number;
  x2?: number;
  y2?: number;
  label?: string;
  color?: string;
  angle?: number;
  radius?: number;
  magnitude?: number;
  direction?: string;
  properties?: Record<string, any>;
}

export interface Diagram {
  type: string;
  elements: DiagramElement[];
  width: number;
  height: number;
  title: string;
}

export interface AnimationParams {
  speed?: number;
  amplitude?: number;
  frequency?: number;
  angle?: number;
  initialVelocity?: number;
  gravity?: number;
  fieldStrength?: number;
  wavelength?: number;
  refractiveIndex?: number;
}

export interface AnimationData {
  type: string;
  parameters: AnimationParams;
  description: string;
}

export interface ThreeDObject {
  shape: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  color: string;
  label?: string;
  properties?: Record<string, any>;
}

export interface ThreeDModel {
  type: string;
  objects: ThreeDObject[];
  camera: { position: [number, number, number]; lookAt: [number, number, number] };
  description: string;
}

export interface STEMSolution {
  field: STEMField;
  subTopic: string;
  solution: {
    steps: SolutionStep[];
    finalAnswer: string;
    summary: string;
  };
  formulas: Formula[];
  diagram: Diagram;
  animation: AnimationData;
  threeDModel: ThreeDModel;
}

export const FIELD_COLORS: Record<STEMField, string> = {
  physics: "hsl(var(--physics))",
  mathematics: "hsl(var(--mathematics))",
  chemistry: "hsl(var(--chemistry))",
  engineering: "hsl(var(--engineering))",
  technology: "hsl(var(--technology))",
};

export const FIELD_LABELS: Record<STEMField, string> = {
  physics: "Physics",
  mathematics: "Mathematics",
  chemistry: "Chemistry",
  engineering: "Engineering",
  technology: "Technology",
};

export const FIELD_ICONS: Record<STEMField, string> = {
  physics: "⚛️",
  mathematics: "📐",
  chemistry: "🧪",
  engineering: "⚙️",
  technology: "💻",
};
