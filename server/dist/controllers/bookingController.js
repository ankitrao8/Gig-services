"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingController = void 0;
const store_1 = require("../database/store");
const matchingService_1 = require("../services/matchingService");
class BookingController {
    static async createBooking(req, res) {
        const { workerId, serviceId, bookingType, scheduledDate, scheduledTime, address, latitude, longitude, problemDescription, imageUrl, emergency } = req.body;
        const customer = req.user;
        if (!customer) {
            res.status(401).json({ success: false, message: 'Authentication required to create booking' });
            return;
        }
        const worker = store_1.db.workers.get(workerId);
        if (!worker) {
            res.status(404).json({ success: false, message: 'Worker not found' });
            return;
        }
        const skill = store_1.db.skills.get(serviceId) || worker.skills[0];
        const serviceName = skill ? skill.name : 'General Cooperative Service';
        const estimatedPrice = worker.startingPrice + (emergency ? 100 : 0);
        const bookingId = `BK-${Date.now().toString().slice(-6)}`;
        const newBooking = {
            id: bookingId,
            customerId: customer.id,
            customerName: customer.name,
            customerPhone: customer.phone,
            workerId: worker.id,
            workerName: worker.name,
            workerPhone: worker.phone,
            serviceId: (skill && 'id' in skill) ? skill.id : (skill ? skill.skillId : 'sk-elec'),
            serviceName,
            bookingType: emergency ? 'EMERGENCY' : (bookingType || 'SCHEDULED'),
            status: emergency ? 'ACCEPTED' : 'REQUESTED',
            scheduledDate: scheduledDate || new Date().toISOString().split('T')[0],
            scheduledTime: scheduledTime || '10:00 AM',
            address: address || 'Dashashwamedh Ghat Road, Varanasi',
            latitude: latitude || 25.3176,
            longitude: longitude || 82.9739,
            estimatedPrice,
            finalPrice: estimatedPrice,
            emergency: !!emergency,
            problemDescription,
            imageUrl,
            createdAt: new Date().toISOString()
        };
        store_1.db.bookings.set(newBooking.id, newBooking);
        // Notify worker
        store_1.db.notifications.set(`notif-${Date.now()}`, {
            id: `notif-${Date.now()}`,
            userId: worker.userId,
            title: emergency ? '🚨 EMERGENCY Booking Assigned!' : 'New Booking Request',
            message: `${customer.name} booked ${serviceName} for ${newBooking.scheduledDate} at ${newBooking.scheduledTime}.`,
            type: emergency ? 'EMERGENCY' : 'BOOKING',
            read: false,
            createdAt: new Date().toISOString()
        });
        res.status(201).json({
            success: true,
            message: emergency ? 'Emergency service dispatched!' : 'Booking created successfully',
            booking: newBooking
        });
    }
    static async createEmergencyBooking(req, res) {
        const { serviceId, address, latitude, longitude, problemDescription } = req.body;
        const customer = req.user;
        const lat = latitude || 25.3176;
        const lng = longitude || 82.9739;
        // Find nearest available verified worker
        const matchedWorkers = matchingService_1.MatchingService.findWorkers({
            skillId: serviceId,
            customerLat: lat,
            customerLng: lng,
            emergency: true,
            onlyAvailable: true
        });
        if (matchedWorkers.length === 0) {
            res.status(404).json({
                success: false,
                message: 'No available verified cooperative workers found within your immediate radius. Please try another category or scheduled booking.'
            });
            return;
        }
        const assignedWorker = matchedWorkers[0];
        const skill = store_1.db.skills.get(serviceId) || assignedWorker.skills[0];
        const serviceName = skill ? skill.name : 'Emergency Service';
        const bookingId = `BK-EMG-${Date.now().toString().slice(-5)}`;
        const newBooking = {
            id: bookingId,
            customerId: customer ? customer.id : 'usr-cust-1',
            customerName: customer ? customer.name : 'Sunita Sharma',
            customerPhone: customer ? customer.phone : '9999999999',
            workerId: assignedWorker.id,
            workerName: assignedWorker.name,
            workerPhone: assignedWorker.phone,
            serviceId: (skill && 'id' in skill) ? skill.id : (skill ? skill.skillId : 'sk-elec'),
            serviceName,
            bookingType: 'EMERGENCY',
            status: 'ACCEPTED',
            scheduledDate: new Date().toISOString().split('T')[0],
            scheduledTime: 'Immediate (Within 15 mins)',
            address: address || 'Current Detected Location, Varanasi',
            latitude: lat,
            longitude: lng,
            estimatedPrice: assignedWorker.startingPrice + 100, // emergency fee
            finalPrice: assignedWorker.startingPrice + 100,
            emergency: true,
            problemDescription: problemDescription || 'Urgent repair assistance requested.',
            createdAt: new Date().toISOString()
        };
        store_1.db.bookings.set(newBooking.id, newBooking);
        res.status(201).json({
            success: true,
            message: `Emergency booking confirmed! Worker ${assignedWorker.name} has been assigned.`,
            booking: newBooking,
            worker: {
                name: assignedWorker.name,
                phone: assignedWorker.phone,
                rating: assignedWorker.averageRating,
                distanceKm: assignedWorker.distanceKm,
                etaMinutes: assignedWorker.etaMinutes,
                society: assignedWorker.societyName
            }
        });
    }
    static async getBookings(req, res) {
        const { status, role } = req.query;
        let list = Array.from(store_1.db.bookings.values());
        const user = req.user;
        if (user) {
            if (user.role === 'CUSTOMER') {
                list = list.filter(b => b.customerId === user.id);
            }
            else if (user.role === 'WORKER') {
                const worker = Array.from(store_1.db.workers.values()).find(w => w.userId === user.id);
                if (worker) {
                    list = list.filter(b => b.workerId === worker.id);
                }
            }
        }
        if (status) {
            list = list.filter(b => b.status === status);
        }
        // Sort newest first
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        res.json({
            success: true,
            count: list.length,
            bookings: list
        });
    }
    static async getBookingById(req, res) {
        const { id } = req.params;
        const booking = store_1.db.bookings.get(id);
        if (!booking) {
            res.status(404).json({ success: false, message: 'Booking not found' });
            return;
        }
        const worker = store_1.db.workers.get(booking.workerId);
        const payment = Array.from(store_1.db.payments.values()).find(p => p.bookingId === booking.id);
        const rating = Array.from(store_1.db.ratings.values()).find(r => r.bookingId === booking.id);
        res.json({
            success: true,
            booking,
            worker,
            payment,
            rating
        });
    }
    static async updateBookingStatus(req, res) {
        const { id } = req.params;
        const { status } = req.body;
        const booking = store_1.db.bookings.get(id);
        if (!booking) {
            res.status(404).json({ success: false, message: 'Booking not found' });
            return;
        }
        const validStatuses = [
            'REQUESTED',
            'ACCEPTED',
            'WORKER_ON_WAY',
            'IN_PROGRESS',
            'COMPLETED',
            'CANCELLED'
        ];
        if (!validStatuses.includes(status)) {
            res.status(400).json({ success: false, message: 'Invalid booking status' });
            return;
        }
        booking.status = status;
        booking.updatedAt = new Date().toISOString();
        // If completed, update worker jobs count and recalculate skill score
        if (status === 'COMPLETED') {
            const worker = store_1.db.workers.get(booking.workerId);
            if (worker) {
                worker.completedJobs += 1;
                worker.totalEarnings += booking.finalPrice || booking.estimatedPrice;
                const { score, level } = (0, store_1.calculateSkillScore)(worker.completedJobs, worker.averageRating, worker.onTimePercentage);
                worker.skillScore = score;
                worker.skillLevel = level;
                // Add ₹25 to worker welfare fund
                const welfare = store_1.db.welfareRecords.get(worker.id);
                if (welfare) {
                    welfare.welfareFund += 25;
                    welfare.contributions.unshift({
                        date: new Date().toISOString().split('T')[0],
                        amount: 25,
                        bookingId: booking.id,
                        type: 'Booking Welfare Contribution'
                    });
                }
            }
        }
        // Send notifications to customer
        store_1.db.notifications.set(`notif-${Date.now()}`, {
            id: `notif-${Date.now()}`,
            userId: booking.customerId,
            title: `Booking Update: ${status}`,
            message: `Your booking ${booking.id} status changed to ${status}.`,
            type: 'BOOKING',
            read: false,
            createdAt: new Date().toISOString()
        });
        res.json({
            success: true,
            message: `Booking status changed to ${status}`,
            booking
        });
    }
}
exports.BookingController = BookingController;
