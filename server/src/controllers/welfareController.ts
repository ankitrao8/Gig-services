import { Request, Response } from 'express';
import { db } from '../database/store';

export class WelfareController {
  public static async getWelfare(req: Request, res: Response): Promise<void> {
    const { workerId } = req.params;
    let welfare = db.welfareRecords.get(workerId);

    // If not found by worker ID directly, search by user ID or worker ID code
    if (!welfare) {
      const worker = Array.from(db.workers.values()).find(
        w => w.id === workerId || w.userId === workerId || w.workerId === workerId
      );
      if (worker) {
        welfare = db.welfareRecords.get(worker.id);
      }
    }

    if (!welfare) {
      res.status(404).json({ success: false, message: 'Welfare record not found' });
      return;
    }

    res.json({
      success: true,
      welfare
    });
  }

  public static async updateWelfare(req: Request, res: Response): Promise<void> {
    const { workerId } = req.params;
    const { insuranceStatus, welfareFund, accidentCoverage, contributionAmount } = req.body;

    let welfare = db.welfareRecords.get(workerId);
    if (!welfare) {
      const worker = Array.from(db.workers.values()).find(
        w => w.id === workerId || w.userId === workerId || w.workerId === workerId
      );
      if (worker) {
        welfare = db.welfareRecords.get(worker.id);
      }
    }

    if (!welfare) {
      res.status(404).json({ success: false, message: 'Welfare record not found' });
      return;
    }

    if (insuranceStatus) welfare.insuranceStatus = insuranceStatus;
    if (welfareFund !== undefined) welfare.welfareFund = welfareFund;
    if (accidentCoverage) welfare.accidentCoverage = accidentCoverage;

    if (contributionAmount) {
      welfare.welfareFund += Number(contributionAmount);
      welfare.lastContribution = Number(contributionAmount);
      welfare.contributions.unshift({
        date: new Date().toISOString().split('T')[0],
        amount: Number(contributionAmount),
        type: 'Voluntary Member Welfare Deposit'
      });
    }

    welfare.lastUpdated = new Date().toISOString();

    res.json({
      success: true,
      message: 'Welfare record updated',
      welfare
    });
  }
}
