package com.sahakarseva.controller;

import com.sahakarseva.service.AiClientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/demand-forecast")
public class DemandForecastController {

    private final AiClientService aiClientService;

    public DemandForecastController(AiClientService aiClientService) {
        this.aiClientService = aiClientService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getForecast(
            @RequestParam(defaultValue = "Electrician") String trade,
            @RequestParam(defaultValue = "Ward 2 (Sigra)") String ward,
            @RequestParam(defaultValue = "30") int historicalDays,
            @RequestParam(defaultValue = "7") int forecastHorizonDays
    ) {
        return ResponseEntity.ok(aiClientService.getDemandForecast(trade, ward, historicalDays, forecastHorizonDays));
    }
}
