package com.sahakarseva.repository;

import com.sahakarseva.model.Welfare;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WelfareRepository extends JpaRepository<Welfare, String> {
    Optional<Welfare> findByWorkerId(String workerId);
}
