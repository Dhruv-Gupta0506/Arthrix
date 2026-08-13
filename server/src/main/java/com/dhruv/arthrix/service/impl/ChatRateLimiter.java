package com.dhruv.arthrix.service.impl;

import org.springframework.stereotype.Component;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Component
public class ChatRateLimiter {

    private static final long WINDOW_MILLIS = 10_000;
    private final ConcurrentHashMap<Long, AtomicLong> lastRequestTime = new ConcurrentHashMap<>();

    public boolean allowRequest(Long userId) {
        long now = System.currentTimeMillis();
        AtomicLong last = lastRequestTime.computeIfAbsent(userId, id -> new AtomicLong(0));

        synchronized (last) {
            if (now - last.get() < WINDOW_MILLIS) {
                return false;
            }
            last.set(now);
            return true;
        }
    }
}