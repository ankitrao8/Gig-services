package com.sahakarseva;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
public class SahakarSevaApplication {

    public static void main(String[] args) {
        SpringApplication.run(SahakarSevaApplication.class, args);
        System.out.println("==================================================");
        System.out.println("  Sahakar Seva Spring Boot Backend Started! (SIH 26089)");
        System.out.println("  Connected to PostgreSQL + PostGIS Spatial Engine");
        System.out.println("==================================================");
    }
}
