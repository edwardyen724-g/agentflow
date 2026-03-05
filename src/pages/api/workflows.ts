import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from 'firebase-admin/auth';
import db from '../../../lib/firestore'; // assume Firestore is initialized in this file
import { Workflow } from '../../../types'; // assume a types file exists with the Workflow interface

const firestore = db.firestore();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

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
  const userId = req.query.userId;

  try {
    const snapshot = await firestore.collection('workflows').where('userId', '==', userId).get();
    const workflows: Workflow[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Workflow[];
    res.status(200).json(workflows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch workflows' });
  }
}

async function createWorkflow(req: NextApiRequest, res: NextApiResponse) {
  const { userId, name, steps } = req.body;

  if (!userId || !name || !steps) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const newWorkflow = { userId, name, steps, createdAt: new Date() };
    const docRef = await firestore.collection('workflows').add(newWorkflow);
    res.status(201).json({ id: docRef.id, ...newWorkflow });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create workflow' });
  }
}

async function updateWorkflow(req: NextApiRequest, res: NextApiResponse) {
  const { id, ...updateData } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Workflow ID is required' });
  }

  try {
    await firestore.collection('workflows').doc(id).update(updateData);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to update workflow' });
  }
}

async function deleteWorkflow(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Workflow ID is required' });
  }

  try {
    await firestore.collection('workflows').doc(id as string).delete();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete workflow' });
  }
}