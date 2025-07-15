const mongoose = require('mongoose');

const CubeSchema = new mongoose.Schema({
    cubeId: { type: String, default: 'cube_1' },
    position: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 0 },
        z: { type: Number, default: 0 }
    },
    rotationSpeed: { type: Number, default: 0.01 },
    lastSaved: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cube', CubeSchema);