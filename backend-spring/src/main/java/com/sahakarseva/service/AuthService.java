package com.sahakarseva.service;

import com.sahakarseva.config.JwtTokenProvider;
import com.sahakarseva.dto.AuthDto;
import com.sahakarseva.model.Role;
import com.sahakarseva.model.User;
import com.sahakarseva.model.Worker;
import com.sahakarseva.repository.UserRepository;
import com.sahakarseva.repository.WorkerRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final WorkerRepository workerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(
            UserRepository userRepository,
            WorkerRepository workerRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider jwtTokenProvider
    ) {
        this.userRepository = userRepository;
        this.workerRepository = workerRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public AuthDto.AuthResponse login(AuthDto.LoginRequest request) {
        User user = userRepository.findByPhone(request.getPhone())
                .orElseThrow(() -> new RuntimeException("User not found with phone: " + request.getPhone()));

        // Allow demo mock bypass or check encoded password
        if (request.getPassword() != null && !request.getPassword().equals("demo123")) {
            if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
                throw new RuntimeException("Invalid password credentials");
            }
        }

        String token = jwtTokenProvider.generateToken(user.getId(), user.getPhone(), user.getRole().name());

        String workerId = null;
        if (user.getRole() == Role.WORKER) {
            workerId = workerRepository.findByUserId(user.getId())
                    .map(Worker::getWorkerId)
                    .orElse(null);
        }

        return AuthDto.AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .name(user.getName())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .workerId(workerId)
                .build();
    }

    @Transactional
    public AuthDto.AuthResponse register(AuthDto.RegisterRequest request) {
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new RuntimeException("Phone number already registered: " + request.getPhone());
        }

        String userId = "USR-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        User user = User.builder()
                .id(userId)
                .name(request.getName())
                .phone(request.getPhone())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword() != null ? request.getPassword() : "demo123"))
                .role(request.getRole() != null ? request.getRole() : Role.CUSTOMER)
                .language("en")
                .build();

        userRepository.save(user);

        String workerId = null;
        if (user.getRole() == Role.WORKER) {
            workerId = "SKR-" + (request.getTrade() != null ? request.getTrade().substring(0, 2).toUpperCase() : "WK") + "-" + (10000 + (int)(Math.random() * 90000));
            Worker worker = Worker.builder()
                    .id("WRK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                    .user(user)
                    .workerId(workerId)
                    .primaryTrade(request.getTrade() != null ? request.getTrade() : "Electrician")
                    .latitude(new BigDecimal("25.3176"))
                    .longitude(new BigDecimal("82.9739"))
                    .availabilityStatus("AVAILABLE")
                    .verificationStatus("VERIFIED")
                    .skillLevel("BRONZE")
                    .skillScore(new BigDecimal("75.00"))
                    .build();
            workerRepository.save(worker);
        }

        String token = jwtTokenProvider.generateToken(user.getId(), user.getPhone(), user.getRole().name());

        return AuthDto.AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .name(user.getName())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .workerId(workerId)
                .build();
    }
}
