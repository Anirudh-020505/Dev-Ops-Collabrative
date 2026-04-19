import { Router } from 'express';
import { prisma, io } from '../server';

const router = Router();

router.get('/', async (req, res) => {
  const incidents = await prisma.incident.findMany({ include: { service: true, comments: true } });
  res.json(incidents);
});

router.post('/', async (req, res) => {
  try {
    const incident = await prisma.incident.create({
      data: req.body
    });
    io.emit('incident:new', incident);
    res.json(incident);
  } catch (e) {
    res.status(500).json({ error: 'Failed' });
  }
});

router.post('/:id/comments', async (req, res) => {
  try {
    const comment = await prisma.incidentComment.create({
      data: {
        incidentId: req.params.id,
        userId: "SYSTEM", // Mock
        message: req.body.message
      }
    });
    io.emit('incident:comment', comment);
    res.json(comment);
  } catch (e) {
    res.status(500).json({ error: 'Failed' });
  }
});

export default router;
