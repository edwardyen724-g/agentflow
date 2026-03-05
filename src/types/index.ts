export interface Workflow {
  id: string;
  userId: string;
  name: string;
  steps: WorkflowStep[];
  createdAt: Date | FirebaseFirestore.Timestamp;
}

export interface WorkflowStep {
  id: string;
  type: string;
  config: Record<string, unknown>;
}

export interface Agent {
  id: string;
  name: string;
  status: "active" | "idle" | "error";
  lastRun?: Date | FirebaseFirestore.Timestamp;
}
