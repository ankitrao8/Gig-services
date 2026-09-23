package com.sahakarseva.dto;

import com.sahakarseva.model.Role;
import lombok.*;

public class AuthDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        private String phone;
        private String password;
        private String otp; // Optional simulated OTP
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegisterRequest {
        private String name;
        private String phone;
        private String email;
        private String password;
        private Role role;
        private String societyId;
        private String trade;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AuthResponse {
        private String token;
        private String userId;
        private String name;
        private String phone;
        private String role;
        private String workerId;
        private String societyId;
    }
}
