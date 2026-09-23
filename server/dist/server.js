"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const api_1 = __importDefault(require("./routes/api"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)({
    origin: true,
    credentials: true
}));
app.use(express_1.default.json());
// Request logging in development
app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString().split('T')[1].slice(0, 8)}] ${req.method} ${req.path}`);
    next();
});
// API Routes
app.use('/api', api_1.default);
// Health check
app.get('/api/health', (_req, res) => {
    res.json({
        status: 'OK',
        platform: 'Sahakar Seva API',
        tagline: 'Verified Workers. Fair Work. Trusted Services.',
        demoMode: true,
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});
// Error handling middleware
app.use((err, _req, res, _next) => {
    console.error('Unhandled Server Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});
app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 Sahakar Seva Cooperative API Server Running on Port ${PORT}`);
    console.log(`🌟 Tagline: "Verified Workers. Fair Work. Trusted Services."`);
    console.log(`📌 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🎯 Demo Personas Loaded:`);
    console.log(`   Customer:  9999999999 (OTP: 123456)`);
    console.log(`   Worker:    8888888888 (OTP: 123456)`);
    console.log(`   Admin:     7777777777 (OTP: 123456)`);
    console.log(`=======================================================`);
});
exports.default = app;
