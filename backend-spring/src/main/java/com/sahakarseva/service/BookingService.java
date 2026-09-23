package com.sahakarseva.service;

import com.sahakarseva.dto.BookingDto;
import com.sahakarseva.model.Booking;
import com.sahakarseva.model.User;
import com.sahakarseva.model.Worker;
import com.sahakarseva.repository.BookingRepository;
import com.sahakarseva.repository.UserRepository;
import com.sahakarseva.repository.WorkerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final WorkerRepository workerRepository;
    private final NotificationService notificationService;

    public BookingService(
            BookingRepository bookingRepository,
            UserRepository userRepository,
            WorkerRepository workerRepository,
            NotificationService notificationService
    ) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.workerRepository = workerRepository;
        this.notificationService = notificationService;
    }

    public List<Booking> getCustomerBookings(String customerId) {
        return bookingRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
    }

    public List<Booking> getWorkerBookings(String workerId) {
        return bookingRepository.findByWorkerIdOrderByCreatedAtDesc(workerId);
    }

    public Booking getBookingById(String id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found: " + id));
    }

    @Transactional
    public Booking createBooking(BookingDto.CreateBookingRequest req) {
        User customer = userRepository.findById(req.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found: " + req.getCustomerId()));

        Worker worker = null;
        if (req.getWorkerId() != null && !req.getWorkerId().isBlank()) {
            worker = workerRepository.findById(req.getWorkerId()).orElse(null);
        }

        String bookingId = "BKG-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Booking booking = Booking.builder()
                .id(bookingId)
                .customer(customer)
                .worker(worker)
                .serviceName(req.getServiceName() != null ? req.getServiceName() : "Electrician Service")
                .bookingType(req.getBookingType() != null ? req.getBookingType() : (Boolean.TRUE.equals(req.getEmergency()) ? "EMERGENCY" : "INSTANT"))
                .status("REQUESTED")
                .scheduledDate(req.getScheduledDate() != null ? req.getScheduledDate() : LocalDate.now())
                .scheduledTime(req.getScheduledTime() != null ? req.getScheduledTime() : "Immediate")
                .address(req.getAddress() != null ? req.getAddress() : "Sigra, Varanasi")
                .latitude(req.getLatitude() != null ? BigDecimal.valueOf(req.getLatitude()) : new BigDecimal("25.3176"))
                .longitude(req.getLongitude() != null ? BigDecimal.valueOf(req.getLongitude()) : new BigDecimal("82.9739"))
                .estimatedPrice(req.getEstimatedPrice() != null ? req.getEstimatedPrice() : new BigDecimal("350.00"))
                .emergency(Boolean.TRUE.equals(req.getEmergency()))
                .problemDescription(req.getProblemDescription())
                .build();

        Booking saved = bookingRepository.save(booking);

        // Notify Worker if assigned
        if (worker != null && worker.getUser() != null) {
            String alert = Boolean.TRUE.equals(req.getEmergency())
                    ? "🚨 EMERGENCY DISPATCH: Urgent job request in your ward!"
                    : "New Booking Request: " + booking.getServiceName();
            notificationService.sendNotification(worker.getUser().getId(), "New Job Alert", alert, "BOOKING_REQUEST");
        }

        return saved;
    }

    @Transactional
    public Booking updateStatus(String bookingId, String status) {
        Booking booking = getBookingById(bookingId);
        booking.setStatus(status);

        if ("COMPLETED".equalsIgnoreCase(status)) {
            booking.setFinalPrice(booking.getEstimatedPrice());
            if (booking.getWorker() != null) {
                Worker w = booking.getWorker();
                w.setCompletedJobs(w.getCompletedJobs() + 1);
                w.setTotalEarnings(w.getTotalEarnings().add(booking.getEstimatedPrice().multiply(new BigDecimal("0.98")))); // 2% welfare deduction
                workerRepository.save(w);
            }
        }

        Booking updated = bookingRepository.save(booking);

        // Dispatch status update notification
        if (booking.getCustomer() != null) {
            notificationService.sendNotification(
                    booking.getCustomer().getId(),
                    "Booking Status Update",
                    "Your booking (" + booking.getId() + ") status is now: " + status,
                    "STATUS_UPDATE"
            );
        }

        return updated;
    }
}
