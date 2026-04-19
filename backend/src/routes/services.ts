import { Router } from 'express';
import { prisma, io } from '../server';

const router = Router();

router.get('/', async (req, res) => {
  const services = await prisma.service.findMany({ include: { metrics: { orderBy: { recordedAt: 'desc' }, take: 10 } } });
  res.json(services);
});

router.post('/', async (req, res) => {
  try {
    const service = await prisma.service.create({
      data: {
        name: req.body.name,
        healthCheckUrl: req.body.healthCheckUrl,
        createdBy: "SYSTEM" // mock user id for now
      }
    });
    io.emit('service:new', service);
    res.json(service);
  } catch (e) {
    res.status(500).json({ error: 'Failed' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const service = await prisma.service.update({
      where: { id: req.params.id },
      data: { status: req.body.status }
    });
    io.emit('service:status_change', service);
    res.json(service);
  } catch (e) {
    res.status(500).json({ error: 'Failed' });
  }
});

export default router;
