"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
exports.authenticate = authenticate;
exports.authorizeRoles = authorizeRoles;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const store_1 = require("../database/store");
const JWT_SECRET = process.env.JWT_SECRET || 'sahakar_seva_cooperative_secret_key_2026_jwt';
function generateToken(user) {
    return jsonwebtoken_1.default.sign({ id: user.id, phone: user.phone, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
}
function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    // Support demo token bypass or Bearer token
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        // Check for demo shortcut tokens
        if (token === 'demo-token-customer') {
            const cust = store_1.db.users.get('usr-cust-1');
            if (cust) {
                req.user = cust;
                return next();
            }
        }
        else if (token === 'demo-token-worker') {
            const work = store_1.db.users.get('usr-work-1');
            if (work) {
                req.user = work;
                return next();
            }
        }
        else if (token === 'demo-token-admin') {
            const admin = store_1.db.users.get('usr-admin-1');
            if (admin) {
                req.user = admin;
                return next();
            }
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            const user = store_1.db.users.get(decoded.id);
            if (user) {
                req.user = user;
                return next();
            }
        }
        catch {
            // Fallback
        }
    }
    // Check custom demo user header if testing in client
    const demoRole = req.headers['x-demo-role'];
    if (demoRole) {
        if (demoRole === 'CUSTOMER') {
            req.user = store_1.db.users.get('usr-cust-1');
            return next();
        }
        else if (demoRole === 'WORKER') {
            req.user = store_1.db.users.get('usr-work-1');
            return next();
        }
        else if (demoRole === 'SOCIETY_ADMIN' || demoRole === 'FEDERATION_ADMIN') {
            req.user = store_1.db.users.get('usr-admin-1');
            return next();
        }
    }
    res.status(401).json({ success: false, message: 'Authentication required' });
}
function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Authentication required' });
            return;
        }
        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({ success: false, message: 'Forbidden: Insufficient privileges' });
            return;
        }
        next();
    };
}
