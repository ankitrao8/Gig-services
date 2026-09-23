import { Request, Response } from 'express';
import { db } from '../database/store';

export class CertificateController {
  public static async getCertificatesByWorker(req: Request, res: Response): Promise<void> {
    const { workerId } = req.params;
    const worker = db.workers.get(workerId) || Array.from(db.workers.values()).find(
      w => w.userId === workerId || w.workerId === workerId
    );

    const targetId = worker ? worker.id : workerId;
    const certificates = Array.from(db.certificates.values()).filter(c => c.workerId === targetId);

    res.json({
      success: true,
      count: certificates.length,
      certificates
    });
  }

  /**
   * Public Certificate verification endpoint
   */
  public static async verifyCertificate(req: Request, res: Response): Promise<void> {
    const { token } = req.params;
    const cert = Array.from(db.certificates.values()).find(
      c => c.verificationToken === token || c.certificateNumber === token
    );

    if (!cert) {
      res.status(404).json({
        success: false,
        message: 'Invalid certificate token. No matching cooperative skill milestone certificate found.'
      });
      return;
    }

    const worker = db.workers.get(cert.workerId);

    res.json({
      success: true,
      certificate: {
        ...cert,
        society: worker?.societyName || 'Varanasi Labour Cooperative Society',
        disclaimer: 'This is a Platform-issued Skill Recognition Certificate based on verified customer ratings, on-time punctuality, and completed jobs. It does not represent an official government NSDC/PMKVY credential.'
      }
    });
  }
}
