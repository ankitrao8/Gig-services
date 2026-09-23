"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WelfareController = void 0;
const store_1 = require("../database/store");
class WelfareController {
    static async getWelfare(req, res) {
        const { workerId } = req.params;
        let welfare = store_1.db.welfareRecords.get(workerId);
        // If not found by worker ID directly, search by user ID or worker ID code
        if (!welfare) {
            const worker = Array.from(store_1.db.workers.values()).find(w => w.id === workerId || w.userId === workerId || w.workerId === workerId);
            if (worker) {
                welfare = store_1.db.welfareRecords.get(worker.id);
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
    static async updateWelfare(req, res) {
        const { workerId } = req.params;
        const { insuranceStatus, welfareFund, accidentCoverage, contributionAmount } = req.body;
        let welfare = store_1.db.welfareRecords.get(workerId);
        if (!welfare) {
            const worker = Array.from(store_1.db.workers.values()).find(w => w.id === workerId || w.userId === workerId || w.workerId === workerId);
            if (worker) {
                welfare = store_1.db.welfareRecords.get(worker.id);
            }
        }
        if (!welfare) {
            res.status(404).json({ success: false, message: 'Welfare record not found' });
            return;
        }
        if (insuranceStatus)
            welfare.insuranceStatus = insuranceStatus;
        if (welfareFund !== undefined)
            welfare.welfareFund = welfareFund;
        if (accidentCoverage)
            welfare.accidentCoverage = accidentCoverage;
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
exports.WelfareController = WelfareController;
