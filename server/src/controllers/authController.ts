import { Request, Response } from 'express';
import { db, calculateSkillScore } from '../database/store';
import { generateToken, AuthenticatedRequest } from '../middleware/auth';
import { User, Worker, SkillLevel } from '../types';

export class AuthController {
  public static async login(req: Request, res: Response): Promise<void> {
    const { phone, password, otp } = req.body;

    if (!phone) {
      res.status(400).json({ success: false, message: 'Phone number is required' });
      return;
    }

    // Find user by phone
    const user = Array.from(db.users.values()).find(u => u.phone === phone);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found with this phone number' });
      return;
    }

    // Check OTP or Password (demo accepts '123456' for any OTP or password match)
    if (otp && otp !== '123456') {
      res.status(400).json({ success: false, message: 'Invalid OTP. For demo mode, enter 123456' });
      return;
    }

    const token = generateToken(user);

    // If worker, also fetch worker profile
    let workerProfile: Worker | undefined;
    if (user.role === 'WORKER') {
      workerProfile = Array.from(db.workers.values()).find(w => w.userId === user.id);
    }

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        profilePhoto: user.profilePhoto,
        language: user.language
      },
      worker: workerProfile
    });
  }

  public static async verifyOtp(req: Request, res: Response): Promise<void> {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      res.status(400).json({ success: false, message: 'Phone and OTP are required' });
      return;
    }

    if (otp !== '123456') {
      res.status(400).json({ success: false, message: 'Invalid OTP. For demo mode, enter 123456' });
      return;
    }

    const user = Array.from(db.users.values()).find(u => u.phone === phone);
    if (!user) {
      res.json({
        success: true,
        isNewUser: true,
        message: 'OTP verified. Please proceed with registration.'
      });
      return;
    }

    const token = generateToken(user);
    const workerProfile = user.role === 'WORKER'
      ? Array.from(db.workers.values()).find(w => w.userId === user.id)
      : undefined;

    res.json({
      success: true,
      isNewUser: false,
      message: 'Login successful via OTP',
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        profilePhoto: user.profilePhoto,
        language: user.language
      },
      worker: workerProfile
    });
  }

  public static async register(req: Request, res: Response): Promise<void> {
    const { name, phone, email, role, societyId, skills, address } = req.body;

    if (!name || !phone || !role) {
      res.status(400).json({ success: false, message: 'Name, phone, and role are required' });
      return;
    }

    // Check if phone already exists
    const existing = Array.from(db.users.values()).find(u => u.phone === phone);
    if (existing) {
      res.status(400).json({ success: false, message: 'An account with this phone already exists' });
      return;
    }

    const userId = `usr-reg-${Date.now()}`;
    const newUser: User = {
      id: userId,
      name,
      phone,
      email,
      passwordHash: '$2a$10$demoHashNewUser12345678',
      role: role || 'CUSTOMER',
      profilePhoto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      language: 'en',
      createdAt: new Date().toISOString()
    };
    db.users.set(newUser.id, newUser);

    let newWorker: Worker | undefined;

    if (role === 'WORKER') {
      const workerIdNum = Math.floor(10000 + Math.random() * 90000);
      const workerCode = `SKR-GEN-${workerIdNum}`;
      const soc = societyId ? db.societies.get(societyId) : undefined;

      const workerSkills = (skills || []).map((s: { skillId: string; name: string; experienceYears?: number }) => ({
        skillId: s.skillId,
        name: s.name,
        experienceYears: s.experienceYears || 2,
        skillLevel: 'BRONZE' as SkillLevel
      }));

      const { score, level } = calculateSkillScore(0, 5.0, 100);

      newWorker = {
        id: `wrk-${Date.now()}`,
        userId: newUser.id,
        societyId: societyId || 'soc-varanasi',
        societyName: soc ? soc.name : 'Varanasi Labour & Artisan Cooperative Society',
        workerId: workerCode,
        name: newUser.name,
        phone: newUser.phone,
        profilePhoto: newUser.profilePhoto!,
        governmentIdType: 'Aadhaar (Uploaded)',
        governmentIdVerified: false,
        verificationStatus: 'PENDING',
        availabilityStatus: 'AVAILABLE',
        latitude: 25.3176 + (Math.random() - 0.5) * 0.02,
        longitude: 82.9739 + (Math.random() - 0.5) * 0.02,
        averageRating: 5.0,
        completedJobs: 0,
        onTimePercentage: 100,
        skillScore: score,
        skillLevel: level,
        totalEarnings: 0,
        welfareStatus: 'PENDING',
        insuranceStatus: 'PENDING',
        skills: workerSkills.length > 0 ? workerSkills : [{ skillId: 'sk-elec', name: 'Electrician', experienceYears: 2, skillLevel: 'BRONZE' }],
        startingPrice: 299,
        bio: `${name} is an onboarding cooperative technician waiting for society verification.`,
        createdAt: new Date().toISOString(),
        qrVerificationToken: `${workerCode}-PENDING`
      };
      db.workers.set(newWorker.id, newWorker);

      // Create initial welfare
      db.welfareRecords.set(newWorker.id, {
        id: `welf-${newWorker.id}`,
        workerId: newWorker.id,
        insuranceStatus: 'PENDING',
        insuranceProvider: 'National Cooperative Shramik Suraksha Yojana',
        policyNumber: `POL-PENDING-${newWorker.workerId}`,
        welfareFund: 500,
        accidentCoverage: 'ACTIVE',
        lastContribution: 0,
        nextRenewal: '2027-03-31',
        lastUpdated: new Date().toISOString(),
        contributions: []
      });
    }

    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        phone: newUser.phone,
        email: newUser.email,
        role: newUser.role,
        profilePhoto: newUser.profilePhoto,
        language: newUser.language
      },
      worker: newWorker
    });
  }

  public static async getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const user = req.user;
    let workerProfile: Worker | undefined;
    if (user.role === 'WORKER') {
      workerProfile = Array.from(db.workers.values()).find(w => w.userId === user.id);
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        profilePhoto: user.profilePhoto,
        language: user.language
      },
      worker: workerProfile
    });
  }
}
