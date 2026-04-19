"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const server_1 = require("../server");
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    const incidents = await server_1.prisma.incident.findMany({ include: { service: true, comments: true } });
    res.json(incidents);
});
router.post('/', async (req, res) => {
    try {
        const incident = await server_1.prisma.incident.create({
            data: req.body
        });
        server_1.io.emit('incident:new', incident);
        res.json(incident);
    }
    catch (e) {
        res.status(500).json({ error: 'Failed' });
    }
});
router.post('/:id/comments', async (req, res) => {
    try {
        const comment = await server_1.prisma.incidentComment.create({
            data: {
                incidentId: req.params.id,
                userId: "SYSTEM", // Mock
                message: req.body.message
            }
        });
        server_1.io.emit('incident:comment', comment);
        res.json(comment);
    }
    catch (e) {
        res.status(500).json({ error: 'Failed' });
    }
});
exports.default = router;
