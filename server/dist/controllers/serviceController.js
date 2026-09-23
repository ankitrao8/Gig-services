"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = exports.ServiceController = void 0;
const store_1 = require("../database/store");
class ServiceController {
    static async getServices(req, res) {
        const services = Array.from(store_1.db.skills.values());
        res.json({
            success: true,
            count: services.length,
            services
        });
    }
    static async getServiceById(req, res) {
        const { id } = req.params;
        const service = store_1.db.skills.get(id);
        if (!service) {
            res.status(404).json({ success: false, message: 'Service category not found' });
            return;
        }
        const availableWorkers = Array.from(store_1.db.workers.values()).filter(w => w.verificationStatus === 'VERIFIED' && w.skills.some(s => s.skillId === service.id));
        res.json({
            success: true,
            service,
            workerCount: availableWorkers.length
        });
    }
}
exports.ServiceController = ServiceController;
class NotificationController {
    static async getNotifications(req, res) {
        const { userId } = req.query;
        let notifs = Array.from(store_1.db.notifications.values());
        if (userId) {
            notifs = notifs.filter(n => n.userId === userId);
        }
        notifs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        res.json({
            success: true,
            count: notifs.length,
            notifications: notifs
        });
    }
    static async markRead(req, res) {
        const { id } = req.params;
        const notif = store_1.db.notifications.get(id);
        if (notif) {
            notif.read = true;
        }
        res.json({ success: true, message: 'Notification marked read' });
    }
}
exports.NotificationController = NotificationController;
