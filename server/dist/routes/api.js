"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const workerController_1 = require("../controllers/workerController");
const bookingController_1 = require("../controllers/bookingController");
const paymentController_1 = require("../controllers/paymentController");
const ratingController_1 = require("../controllers/ratingController");
const adminController_1 = require("../controllers/adminController");
const forecastController_1 = require("../controllers/forecastController");
const welfareController_1 = require("../controllers/welfareController");
const certificateController_1 = require("../controllers/certificateController");
const serviceController_1 = require("../controllers/serviceController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Auth routes
router.post('/auth/login', authController_1.AuthController.login);
router.post('/auth/verify-otp', authController_1.AuthController.verifyOtp);
router.post('/auth/register', authController_1.AuthController.register);
router.get('/auth/me', auth_1.authenticate, authController_1.AuthController.getMe);
// Worker routes
router.get('/workers', workerController_1.WorkerController.getWorkers);
router.get('/workers/:id', workerController_1.WorkerController.getWorkerById);
router.get('/workers/:id/id-card', workerController_1.WorkerController.getIdCard);
router.put('/workers/:id/availability', auth_1.authenticate, workerController_1.WorkerController.updateAvailability);
// Public verification (No login required)
router.get('/verify-worker/:token', workerController_1.WorkerController.verifyWorkerPublic);
// Services routes
router.get('/services', serviceController_1.ServiceController.getServices);
router.get('/services/:id', serviceController_1.ServiceController.getServiceById);
// Booking routes
router.post('/bookings', auth_1.authenticate, bookingController_1.BookingController.createBooking);
router.post('/bookings/emergency', auth_1.authenticate, bookingController_1.BookingController.createEmergencyBooking);
router.get('/bookings', auth_1.authenticate, bookingController_1.BookingController.getBookings);
router.get('/bookings/:id', bookingController_1.BookingController.getBookingById);
router.put('/bookings/:id/status', auth_1.authenticate, bookingController_1.BookingController.updateBookingStatus);
// Payments & Invoices
router.post('/payments', auth_1.authenticate, paymentController_1.PaymentController.processPayment);
router.get('/payments/:bookingId', paymentController_1.PaymentController.getPaymentByBooking);
// Ratings & Reviews
router.post('/ratings', auth_1.authenticate, ratingController_1.RatingController.submitRating);
router.get('/workers/:id/ratings', ratingController_1.RatingController.getWorkerRatings);
// AI Forecasting & Workforce Allocation
router.get('/forecast', forecastController_1.ForecastController.getForecast);
router.get('/workforce/recommendations', forecastController_1.ForecastController.getWorkforceRecommendations);
// Admin Console
router.get('/admin/analytics', auth_1.authenticate, (0, auth_1.authorizeRoles)('SOCIETY_ADMIN', 'FEDERATION_ADMIN'), adminController_1.AdminController.getAnalytics);
router.get('/admin/workers', auth_1.authenticate, (0, auth_1.authorizeRoles)('SOCIETY_ADMIN', 'FEDERATION_ADMIN'), adminController_1.AdminController.getWorkersList);
router.put('/admin/workers/:id/verify', auth_1.authenticate, (0, auth_1.authorizeRoles)('SOCIETY_ADMIN', 'FEDERATION_ADMIN'), adminController_1.AdminController.verifyWorker);
router.get('/admin/fraud', auth_1.authenticate, (0, auth_1.authorizeRoles)('SOCIETY_ADMIN', 'FEDERATION_ADMIN'), adminController_1.AdminController.getFraudAlerts);
router.get('/admin/societies', adminController_1.AdminController.getSocieties);
// Welfare & Insurance
router.get('/welfare/:workerId', welfareController_1.WelfareController.getWelfare);
router.put('/welfare/:workerId', auth_1.authenticate, welfareController_1.WelfareController.updateWelfare);
// Milestone Recognition Certificates
router.get('/certificates/:workerId', certificateController_1.CertificateController.getCertificatesByWorker);
router.get('/certificates/verify/:token', certificateController_1.CertificateController.verifyCertificate);
// Notifications
router.get('/notifications', serviceController_1.NotificationController.getNotifications);
router.put('/notifications/:id/read', serviceController_1.NotificationController.markRead);
exports.default = router;
