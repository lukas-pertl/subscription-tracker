package com.portfolio.backend.config;

import com.portfolio.backend.model.BillingCycle;
import com.portfolio.backend.model.Subscription;
import com.portfolio.backend.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final SubscriptionRepository repository;

    @Override
    public void run(String... args) {
        if (repository.count() == 0) {
            repository.saveAll(List.of(
                    new Subscription(null, "Netflix Standard", "Entertainment", 15.99, BillingCycle.MONTHLY, LocalDate.now().plusDays(5), true),
                    new Subscription(null, "Amazon Prime", "Shopping & Video", 89.90, BillingCycle.YEARLY, LocalDate.now().plusDays(18), true),
                    new Subscription(null, "Spotify", "Musik", 21.99 , BillingCycle.MONTHLY, LocalDate.now().plusDays(12), true),
                    new Subscription(null, "IntelliJ IDEA (Ultimate)", "Software", 159.00, BillingCycle.YEARLY, LocalDate.now().plusMonths(4), false)
            ));
        }
    }
}