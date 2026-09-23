package com.sahakarseva.controller;

import com.sahakarseva.model.Certificate;
import com.sahakarseva.model.Worker;
import com.sahakarseva.repository.CertificateRepository;
import com.sahakarseva.repository.WorkerRepository;
import com.sahakarseva.service.AiClientService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/certificates")
public class CertificateController {

    private final CertificateRepository certificateRepository;
    private final WorkerRepository workerRepository;
    private final AiClientService aiClientService;

    public CertificateController(
            CertificateRepository certificateRepository,
            WorkerRepository workerRepository,
            AiClientService aiClientService
    ) {
        this.certificateRepository = certificateRepository;
        this.workerRepository = workerRepository;
        this.aiClientService = aiClientService;
    }

    @GetMapping("/worker/{workerId}")
    public ResponseEntity<List<Certificate>> getWorkerCertificates(@PathVariable String workerId) {
        return ResponseEntity.ok(certificateRepository.findByWorkerId(workerId));
    }

    @GetMapping("/verify/{token}")
    public ResponseEntity<Map<String, Object>> verifyCertificate(@PathVariable String token) {
        return certificateRepository.findByVerificationToken(token)
                .map(cert -> {
                    Map<String, Object> resp = new HashMap<>();
                    resp.put("verified", true);
                    resp.put("certificate_number", cert.getCertificateNumber());
                    resp.put("worker_id", cert.getWorker().getWorkerId());
                    resp.put("skill", cert.getSkill());
                    resp.put("level", cert.getLevel());
                    resp.put("issue_date", cert.getIssueDate());
                    resp.put("society_name", cert.getWorker().getSociety() != null ? cert.getWorker().getSociety().getName() : "Cooperative Federation");
                    return ResponseEntity.ok(resp);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> downloadCertificatePdf(@PathVariable String id) {
        Certificate cert = certificateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Certificate not found: " + id));

        Worker w = cert.getWorker();
        Map<String, Object> details = Map.of(
                "worker_name", w.getUser() != null ? w.getUser().getName() : "Certified Worker",
                "worker_id", w.getWorkerId(),
                "trade", cert.getSkill(),
                "skill_level", cert.getLevel(),
                "skill_score", w.getSkillScore().doubleValue(),
                "society_name", w.getSociety() != null ? w.getSociety().getName() : "Kashi Shramik Sahakari Samiti",
                "certificate_number", cert.getCertificateNumber(),
                "issue_date", cert.getIssueDate().toString(),
                "verification_token", cert.getVerificationToken()
        );

        byte[] pdfBytes = aiClientService.generateCertificatePdf(details);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=Certificate_" + cert.getCertificateNumber() + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
}
