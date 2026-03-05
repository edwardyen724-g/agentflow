import { NextApiRequest, NextApiResponse } from 'next';
import * as admin from 'firebase-admin';
import db from '../../../lib/firestore';
import type { Workflow } from '../../../types';

const firestore = db.firestore();

interface AuthedRequest extends NextApiRequest {
  userId?: string;
}

export default async function handler(req: AuthedRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.userId = decoded.uid;
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      return getWorkflows(req, res);
    case 'POST':
      return createWorkflow(req, res);
    case 'PUT':
      return updateWorkflow(req, res);
    case 'DELETE':
      return deleteWorkflow(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getWorkflows(req: AuthedRequest, res: NextApiResponse) {
  try {
    const snapshot = await firestore
      .collection('workflows')
      .where('userId', '==', req.userId)
      .get();
    const workflows: Workflow[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Workflow, 'id'>),
    }));
    return res.status(200).json(workflows);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return res.status(500).json({ error: `Failed to fetch workflows: ${message}` });
  }
}

async function createWorkflow(req: AuthedRequest, res: NextApiResponse) {
  const { name, steps } = req.body as { name?: string; steps?: unknown[] };

  if (!name || !steps) {
    return res.status(400).json({ error: 'Missing required fields: name, steps' });
  }

  try {
    const newWorkflow = { userId: req.userId, name, steps, createdAt: new Date() };
    // ... logic to add the new workflow to Firestore
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: `Failed to create workflow: ${message}` });
  }
}
