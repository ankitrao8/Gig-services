package com.sahakarseva.controller;

import com.sahakarseva.model.Worker;
import com.sahakarseva.service.WorkerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workers")
public class WorkerController {

    private final WorkerService workerService;

    public WorkerController(WorkerService workerService) {
        this.workerService = workerService;
    }

    @GetMapping
    public ResponseEntity<List<Worker>> getAllWorkers() {
        return ResponseEntity.ok(workerService.getAllWorkers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Worker> getWorkerById(@PathVariable String id) {
        return workerService.getWorkerById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/token/{workerId}")
    public ResponseEntity<Worker> getWorkerByToken(@PathVariable String workerId) {
        return workerService.getWorkerByToken(workerId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<Worker>> getNearbyWorkers(
            @RequestParam(defaultValue = "25.3176") double lat,
            @RequestParam(defaultValue = "82.9739") double lon,
            @RequestParam(defaultValue = "5000") double radiusMeters,
            @RequestParam(required = false) String trade
    ) {
        return ResponseEntity.ok(workerService.findNearbyWorkers(lat, lon, radiusMeters, trade));
    }
}
