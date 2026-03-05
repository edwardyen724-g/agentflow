import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from 'firebase-admin/auth';
import db from '../../../lib/firestore';
import { Workflow } from '../../../types';

const firestore = db.firestore();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  // Authentication check
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized access' });
  }
  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    req.userId = decodedToken.uid;
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized access' });
  }

  switch (method) {
    case 'GET':
      await getWorkflows(req, res);
      break;
    case 'POST':
      await createWorkflow(req, res);
      break;
    case 'PUT':
      await updateWorkflow(req, res);
      break;
    case 'DELETE':
      await deleteWorkflow(req, res);
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function getWorkflows(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.userId;

  try {
    const snapshot = await firestore.collection('workflows').where('userId', '==', userId).get();
    const workflows: Workflow[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Workflow[];
    res.status(200).json(workflows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch workflows: ' + error.message });
  }
}

async function createWorkflow(req: NextApiRequest, res: NextApiResponse) {
  const { userId, name, steps } = req.body;

  if (!userId || !name || !steps) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const newWorkflow = { userId, name, steps, createdAt: new Date() };
    // ... (process to add workflow goes here)
    res.status(201).json({ message: 'Workflow created successfully.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create workflow: ' + error.message });
  }
}