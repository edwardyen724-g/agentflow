export interface Workflow {
  id: string;
  name: string;
  steps: unknown[];
  createdAt: Date;
  userId: string;
}
