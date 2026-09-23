import { Request, Response } from 'express';
import { db } from '../database/store';

export class ServiceController {
  public static async getServices(req: Request, res: Response): Promise<void> {
    const services = Array.from(db.skills.values());
    res.json({
      success: true,
      count: services.length,
      services
    });
  }

  public static async getServiceById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const service = db.skills.get(id);

    if (!service) {
      res.status(404).json({ success: false, message: 'Service category not found' });
      return;
    }

    const availableWorkers = Array.from(db.workers.values()).filter(
      w => w.verificationStatus === 'VERIFIED' && w.skills.some(s => s.skillId === service.id)
    );

    res.json({
      success: true,
      service,
      workerCount: availableWorkers.length
    });
  }
}

export class NotificationController {
  public static async getNotifications(req: Request, res: Response): Promise<void> {
    const { userId } = req.query;
    let notifs = Array.from(db.notifications.values());

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

  public static async markRead(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const notif = db.notifications.get(id);
    if (notif) {
      notif.read = true;
    }
    res.json({ success: true, message: 'Notification marked read' });
  }
}
