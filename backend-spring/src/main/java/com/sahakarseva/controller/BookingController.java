package com.sahakarseva.controller;

import com.sahakarseva.dto.BookingDto;
import com.sahakarseva.model.Booking;
import com.sahakarseva.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<Booking> createBooking(@RequestBody BookingDto.CreateBookingRequest req) {
        return ResponseEntity.ok(bookingService.createBooking(req));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable String id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Booking>> getCustomerBookings(@PathVariable String customerId) {
        return ResponseEntity.ok(bookingService.getCustomerBookings(customerId));
    }

    @GetMapping("/worker/{workerId}")
    public ResponseEntity<List<Booking>> getWorkerBookings(@PathVariable String workerId) {
        return ResponseEntity.ok(bookingService.getWorkerBookings(workerId));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Booking> updateBookingStatus(
            @PathVariable String id,
            @RequestBody BookingDto.UpdateStatusRequest req
    ) {
        return ResponseEntity.ok(bookingService.updateStatus(id, req.getStatus()));
    }
}
