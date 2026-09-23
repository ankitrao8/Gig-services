"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateController = void 0;
const store_1 = require("../database/store");
class CertificateController {
    static async getCertificatesByWorker(req, res) {
        const { workerId } = req.params;
        const worker = store_1.db.workers.get(workerId) || Array.from(store_1.db.workers.values()).find(w => w.userId === workerId || w.workerId === workerId);
        const targetId = worker ? worker.id : workerId;
        const certificates = Array.from(store_1.db.certificates.values()).filter(c => c.workerId === targetId);
        res.json({
            success: true,
            count: certificates.length,
            certificates
        });
    }
    /**
     * Public Certificate verification endpoint
     */
    static async verifyCertificate(req, res) {
        const { token } = req.params;
        const cert = Array.from(store_1.db.certificates.values()).find(c => c.verificationToken === token || c.certificateNumber === token);
        if (!cert) {
            res.status(404).json({
                success: false,
                message: 'Invalid certificate token. No matching cooperative skill milestone certificate found.'
            });
            return;
        }
        const worker = store_1.db.workers.get(cert.workerId);
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
exports.CertificateController = CertificateController;
