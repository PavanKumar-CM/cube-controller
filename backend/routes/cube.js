const express = require('express');
const router = express.Router();
const Cube = require('../models/Cube');

// GET cube state
router.get('/:id', async (req, res) => {
    try {
        const cube = await Cube.findOne({ cubeId: req.params.id });
        if (!cube) {
            // If no cube found, return default state
            const defaultCube = {
                cubeId: req.params.id,
                position: { x: 0, y: 0, z: 0 },
                rotationSpeed: 0.01,
                lastSaved: new Date(),
                updatedAt: new Date()
            };
            return res.json(defaultCube);
        }
        res.json(cube);
    } catch (err) {
        console.error('GET error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// SAVE cube state
router.post('/:id/save', async (req, res) => {
    const { position, rotationSpeed } = req.body;

    // Validate input
    if (!position || typeof rotationSpeed !== 'number') {
        return res.status(400).json({ error: 'Invalid input data' });
    }

    const update = {
        cubeId: req.params.id,
        position,
        rotationSpeed,
        lastSaved: new Date(),
        updatedAt: new Date()
    };

    try {
        const saved = await Cube.findOneAndUpdate(
            { cubeId: req.params.id },
            update,
            { new: true, upsert: true }
        );
        res.json({ success: true, data: saved });
    } catch (err) {
        console.error('SAVE error:', err);
        res.status(500).json({ error: 'Save failed' });
    }
});

// RESET cube state
router.post('/:id/reset', async (req, res) => {
    const defaultState = {
        cubeId: req.params.id,
        position: { x: 0, y: 0, z: 0 },
        rotationSpeed: 0.01,
        lastSaved: new Date(),
        updatedAt: new Date()
    };

    try {
        const reset = await Cube.findOneAndUpdate(
            { cubeId: req.params.id },
            defaultState,
            { new: true, upsert: true }
        );
        res.json({ success: true, data: reset });
    } catch (err) {
        console.error('RESET error:', err);
        res.status(500).json({ error: 'Reset failed' });
    }
});

module.exports = router;