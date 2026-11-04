package com.portfolio.backend.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "subscriptions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String category;

    @Column(nullable = false)
    private double price;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BillingCycle billingCycle = BillingCycle.MONTHLY;

    @Column(nullable = false)
    private LocalDate nextBillingDate;

    private boolean active = true;

    @JsonProperty("monthlyCost")
    public double getMonthlyCost() {
        if (!active) return 0.0;
        return billingCycle == BillingCycle.YEARLY
                ? Math.round((price / 12.0) * 100.0) / 100.0
                : price;
    }

    public void advanceBillingDateIfNeeded() {
        if (!active || nextBillingDate == null) return;

        java.time.LocalDate today = java.time.LocalDate.now();

        while (nextBillingDate.isBefore(today)) {
            if (billingCycle == BillingCycle.YEARLY) {
                nextBillingDate = nextBillingDate.plusYears(1);
            } else {
                nextBillingDate = nextBillingDate.plusMonths(1);
            }
        }
    }
}
