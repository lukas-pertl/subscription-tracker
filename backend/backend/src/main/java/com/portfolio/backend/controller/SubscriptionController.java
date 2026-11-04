package com.portfolio.backend.controller;

import com.portfolio.backend.model.Subscription;
import com.portfolio.backend.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "https://subscription-tracker-lac-pi.vercel.app/")
@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService service;

    @GetMapping
    public List<Subscription> getAll() {
        return service.getAll();
    }

    @PostMapping
    public ResponseEntity<Subscription> create(@RequestBody Subscription sub) {
        return new ResponseEntity<>(service.create(sub), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Subscription> update(@PathVariable Long id, @RequestBody Subscription sub) {
        return ResponseEntity.ok(service.update(id, sub));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}