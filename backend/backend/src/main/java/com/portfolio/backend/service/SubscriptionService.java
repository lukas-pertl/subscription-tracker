package com.portfolio.backend.service;

import com.portfolio.backend.model.Subscription;
import com.portfolio.backend.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionRepository repository;

    public List<Subscription> getAll() {
        List<Subscription> subs = repository.findAll();
        boolean updated = false;

        for (Subscription sub : subs) {
            java.time.LocalDate oldDate = sub.getNextBillingDate();
            sub.advanceBillingDateIfNeeded();
            if (!sub.getNextBillingDate().equals(oldDate)) {
                repository.save(sub);
                updated = true;
            }
        }
        return subs;
    }

    public Subscription create(Subscription sub) {
        return repository.save(sub);
    }

    public Subscription update(Long id, Subscription updated) {
        return repository.findById(id)
                .map(sub -> {
                    sub.setName(updated.getName());
                    sub.setCategory(updated.getCategory());
                    sub.setPrice(updated.getPrice());
                    sub.setBillingCycle(updated.getBillingCycle());
                    sub.setNextBillingDate(updated.getNextBillingDate());
                    sub.setActive(updated.isActive());
                    return repository.save(sub);
                })
                .orElseThrow(() -> new RuntimeException("Abo nicht gefunden: " + id));
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}