"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerController = void 0;
const store_1 = require("../database/store");
const matchingService_1 = require("../services/matchingService");
class WorkerController {
    static async getWorkers(req, res) {
        const { service, category, lat, lng, maxDistance, minRating, maxPrice, availableOnly, emergency, search } = req.query;
        let workers = matchingService_1.MatchingService.findWorkers({
            skillId: service,
            category: category,
            customerLat: lat ? parseFloat(lat) : undefined,
            customerLng: lng ? parseFloat(lng) : undefined,
            maxDistanceKm: maxDistance ? parseFloat(maxDistance) : undefined,
            minRating: minRating ? parseFloat(minRating) : undefined,
            maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
            onlyAvailable: availableOnly === 'true',
            emergency: emergency === 'true'
        });
        if (search) {
            const q = search.toLowerCase();
            workers = workers.filter(w => w.name.toLowerCase().includes(q) ||
                w.skills.some(s => s.name.toLowerCase().includes(q)) ||
                w.societyName.toLowerCase().includes(q));
        }
        res.json({
            success: true,
            count: workers.length,
            workers
        });
    }
    static async getWorkerById(req, res) {
        const { id } = req.params;
        const worker = store_1.db.workers.get(id) || Array.from(store_1.db.workers.values()).find(w => w.workerId === id || w.userId === id);
        if (!worker) {
            res.status(404).json({ success: false, message: 'Worker not found' });
            return;
        }
        // Fetch worker reviews
        const reviews = Array.from(store_1.db.ratings.values())
            .filter(r => r.workerId === worker.id && !r.flaggedSuspicious)
            .slice(0, 10);
        // Fetch certificates
        const certificates = Array.from(store_1.db.certificates.values()).filter(c => c.workerId === worker.id);
        // Fetch welfare summary
        const welfare = store_1.db.welfareRecords.get(worker.id);
        res.json({
            success: true,
            worker,
            reviews,
            certificates,
            welfare: welfare ? {
                insuranceStatus: welfare.insuranceStatus,
                insuranceProvider: welfare.insuranceProvider,
                accidentCoverage: welfare.accidentCoverage,
                welfareFund: welfare.welfareFund
            } : undefined
        });
    }
    static async getIdCard(req, res) {
        const { id } = req.params;
        const worker = store_1.db.workers.get(id) || Array.from(store_1.db.workers.values()).find(w => w.workerId === id || w.userId === id);
        if (!worker) {
            res.status(404).json({ success: false, message: 'Worker not found' });
            return;
        }
        res.json({
            success: true,
            idCard: {
                platformName: 'SAHAKAR SEVA',
                title: 'COOPERATIVE WORKER ID',
                workerId: worker.workerId,
                name: worker.name,
                photo: worker.profilePhoto,
                society: worker.societyName,
                skills: worker.skills.map(s => s.name),
                skillLevel: worker.skillLevel,
                rating: worker.averageRating,
                completedJobs: worker.completedJobs,
                onTimePercentage: worker.onTimePercentage,
                status: worker.verificationStatus === 'VERIFIED' ? 'ACTIVE' : 'PENDING',
                verificationToken: worker.qrVerificationToken,
                qrUrl: `/verify-worker/${worker.qrVerificationToken}`,
                issuedDate: worker.createdAt
            }
        });
    }
    /**
     * Public QR Verification endpoint:
     * Works without login. Strictly redacts phone numbers, home address, and government IDs.
     */
    static async verifyWorkerPublic(req, res) {
        const { token } = req.params;
        const worker = Array.from(store_1.db.workers.values()).find(w => w.qrVerificationToken === token || w.workerId === token);
        if (!worker) {
            res.status(404).json({
                success: false,
                message: 'Invalid QR verification token. Worker record not found in cooperative federation directory.'
            });
            return;
        }
        res.json({
            success: true,
            publicVerification: {
                name: worker.name,
                photo: worker.profilePhoto,
                workerId: worker.workerId,
                society: worker.societyName,
                skills: worker.skills.map(s => s.name),
                skillLevel: worker.skillLevel,
                rating: worker.averageRating,
                completedJobs: worker.completedJobs,
                onTimePercentage: worker.onTimePercentage,
                verificationStatus: worker.verificationStatus,
                verificationTimestamp: worker.createdAt,
                verifiedBy: 'Sahakar Seva Cooperative Platform & Federation Registry'
            }
        });
    }
    static async updateAvailability(req, res) {
        const { id } = req.params;
        const { status } = req.body;
        const worker = store_1.db.workers.get(id) || Array.from(store_1.db.workers.values()).find(w => w.userId === id);
        if (!worker) {
            res.status(404).json({ success: false, message: 'Worker not found' });
            return;
        }
        if (!['AVAILABLE', 'BUSY', 'OFFLINE'].includes(status)) {
            res.status(400).json({ success: false, message: 'Invalid availability status' });
            return;
        }
        worker.availabilityStatus = status;
        res.json({
            success: true,
            message: `Availability status updated to ${status}`,
            availabilityStatus: worker.availabilityStatus
        });
    }
}
exports.WorkerController = WorkerController;
