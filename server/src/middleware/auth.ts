import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../database/store';
import { Role, User } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'sahakar_seva_cooperative_secret_key_2026_jwt';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export function generateToken(user: User): string {
  return jwt.sign(
    { id: user.id, phone: user.phone, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  // Support demo token bypass or Bearer token
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    // Check for demo shortcut tokens
    if (token === 'demo-token-customer') {
      const cust = db.users.get('usr-cust-1');
      if (cust) {
        req.user = cust;
        return next();
      }
    } else if (token === 'demo-token-worker') {
      const work = db.users.get('usr-work-1');
      if (work) {
        req.user = work;
        return next();
      }
    } else if (token === 'demo-token-admin') {
      const admin = db.users.get('usr-admin-1');
      if (admin) {
        req.user = admin;
        return next();
      }
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
      const user = db.users.get(decoded.id);
      if (user) {
        req.user = user;
        return next();
      }
    } catch {
      // Fallback
    }
  }

  // Check custom demo user header if testing in client
  const demoRole = req.headers['x-demo-role'] as string;
  if (demoRole) {
    if (demoRole === 'CUSTOMER') {
      req.user = db.users.get('usr-cust-1');
      return next();
    } else if (demoRole === 'WORKER') {
      req.user = db.users.get('usr-work-1');
      return next();
    } else if (demoRole === 'SOCIETY_ADMIN' || demoRole === 'FEDERATION_ADMIN') {
      req.user = db.users.get('usr-admin-1');
      return next();
    }
  }

  res.status(401).json({ success: false, message: 'Authentication required' });
}

export function authorizeRoles(...allowedRoles: Role[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
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
