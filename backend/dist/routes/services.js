"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const server_1 = require("../server");
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    const services = await server_1.prisma.service.findMany({ include: { metrics: { orderBy: { recordedAt: 'desc' }, take: 10 } } });
    res.json(services);
});
router.post('/', async (req, res) => {
    try {
        const service = await server_1.prisma.service.create({
            data: {
                name: req.body.name,
                healthCheckUrl: req.body.healthCheckUrl,
                createdBy: "SYSTEM" // mock user id for now
            }
        });
        server_1.io.emit('service:new', service);
        res.json(service);
    }
    catch (e) {
        res.status(500).json({ error: 'Failed' });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const service = await server_1.prisma.service.update({
            where: { id: req.params.id },
            data: { status: req.body.status }
        });
        server_1.io.emit('service:status_change', service);
        res.json(service);
    }
    catch (e) {
        res.status(500).json({ error: 'Failed' });
    }
});
exports.default = router;
