package com.sahakarseva.repository;

import com.sahakarseva.model.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, String> {
    List<Certificate> findByWorkerId(String workerId);
    Optional<Certificate> findByVerificationToken(String verificationToken);
    Optional<Certificate> findByCertificateNumber(String certificateNumber);
}
