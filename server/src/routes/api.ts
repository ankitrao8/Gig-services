import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { WorkerController } from '../controllers/workerController';
import { BookingController } from '../controllers/bookingController';
import { PaymentController } from '../controllers/paymentController';
import { RatingController } from '../controllers/ratingController';
import { AdminController } from '../controllers/adminController';
import { ForecastController } from '../controllers/forecastController';
import { WelfareController } from '../controllers/welfareController';
import { CertificateController } from '../controllers/certificateController';
import { ServiceController, NotificationController } from '../controllers/serviceController';
import { authenticate, authorizeRoles } from '../middleware/auth';

const router = Router();

// Auth routes
router.post('/auth/login', AuthController.login);
router.post('/auth/verify-otp', AuthController.verifyOtp);
router.post('/auth/register', AuthController.register);
router.get('/auth/me', authenticate, AuthController.getMe);

// Worker routes
router.get('/workers', WorkerController.getWorkers);
router.get('/workers/:id', WorkerController.getWorkerById);
router.get('/workers/:id/id-card', WorkerController.getIdCard);
router.put('/workers/:id/availability', authenticate, WorkerController.updateAvailability);

// Public verification (No login required)
router.get('/verify-worker/:token', WorkerController.verifyWorkerPublic);

// Services routes
router.get('/services', ServiceController.getServices);
router.get('/services/:id', ServiceController.getServiceById);

// Booking routes
router.post('/bookings', authenticate, BookingController.createBooking);
router.post('/bookings/emergency', authenticate, BookingController.createEmergencyBooking);
router.get('/bookings', authenticate, BookingController.getBookings);
router.get('/bookings/:id', BookingController.getBookingById);
router.put('/bookings/:id/status', authenticate, BookingController.updateBookingStatus);

// Payments & Invoices
router.post('/payments', authenticate, PaymentController.processPayment);
router.get('/payments/:bookingId', PaymentController.getPaymentByBooking);

// Ratings & Reviews
router.post('/ratings', authenticate, RatingController.submitRating);
router.get('/workers/:id/ratings', RatingController.getWorkerRatings);

// AI Forecasting & Workforce Allocation
router.get('/forecast', ForecastController.getForecast);
router.get('/workforce/recommendations', ForecastController.getWorkforceRecommendations);

// Admin Console
router.get('/admin/analytics', authenticate, authorizeRoles('SOCIETY_ADMIN', 'FEDERATION_ADMIN'), AdminController.getAnalytics);
router.get('/admin/workers', authenticate, authorizeRoles('SOCIETY_ADMIN', 'FEDERATION_ADMIN'), AdminController.getWorkersList);
router.put('/admin/workers/:id/verify', authenticate, authorizeRoles('SOCIETY_ADMIN', 'FEDERATION_ADMIN'), AdminController.verifyWorker);
router.get('/admin/fraud', authenticate, authorizeRoles('SOCIETY_ADMIN', 'FEDERATION_ADMIN'), AdminController.getFraudAlerts);
router.get('/admin/societies', AdminController.getSocieties);

// Welfare & Insurance
router.get('/welfare/:workerId', WelfareController.getWelfare);
router.put('/welfare/:workerId', authenticate, WelfareController.updateWelfare);

// Milestone Recognition Certificates
router.get('/certificates/:workerId', CertificateController.getCertificatesByWorker);
router.get('/certificates/verify/:token', CertificateController.verifyCertificate);

// Notifications
router.get('/notifications', NotificationController.getNotifications);
router.put('/notifications/:id/read', NotificationController.markRead);

export default router;
