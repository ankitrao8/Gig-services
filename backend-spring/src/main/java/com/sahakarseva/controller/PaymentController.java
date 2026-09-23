package com.sahakarseva.controller;

import com.sahakarseva.dto.PaymentDto;
import com.sahakarseva.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/intent")
    public ResponseEntity<PaymentDto.PaymentIntentResponse> createPaymentIntent(
            @RequestBody PaymentDto.PaymentIntentRequest request
    ) {
        return ResponseEntity.ok(paymentService.createPaymentIntent(request));
    }

    @GetMapping("/invoice/{bookingId}")
    public ResponseEntity<PaymentDto.InvoiceResponse> getInvoice(@PathVariable String bookingId) {
        return ResponseEntity.ok(paymentService.generateInvoice(bookingId));
    }
}
