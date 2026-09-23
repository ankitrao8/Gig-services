package com.sahakarseva.repository;

import com.sahakarseva.model.Society;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SocietyRepository extends JpaRepository<Society, String> {
    Optional<Society> findByRegistrationNumber(String registrationNumber);
    List<Society> findByDistrict(String district);
    List<Society> findByState(String state);
}
