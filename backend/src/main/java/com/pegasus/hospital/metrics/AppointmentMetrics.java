package com.pegasus.hospital.metrics;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.Gauge;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AppointmentMetrics {
    private final MeterRegistry meterRegistry;
    
    @Autowired
    public AppointmentMetrics(MeterRegistry meterRegistry) {
        this.meterRegistry = meterRegistry;
    }
    
    public void recordAppointment(String status) {
        Counter.builder("appointments.total")
            .tag("status", status)
            .register(meterRegistry)
            .increment();
    }
    
    public void recordScheduleAvailability(Long scheduleId, int available) {
        Gauge.builder("schedule.available_slots", () -> available)
            .tag("schedule_id", String.valueOf(scheduleId))
            .register(meterRegistry);
    }
}
