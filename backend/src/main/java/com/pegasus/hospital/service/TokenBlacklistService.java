package com.pegasus.hospital.service;

import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TokenBlacklistService {

    // Simulating Redis with ConcurrentHashMap
    // Key: Token, Value: Expiration Time
    private final Map<String, Long> blacklist = new ConcurrentHashMap<>();

    public void addToBlacklist(String token, Date expirationDate) {
        blacklist.put(token, expirationDate.getTime());
        cleanUp(); // Ideally, cleanup should be a scheduled task
    }

    public boolean isBlacklisted(String token) {
        Long expiration = blacklist.get(token);
        if (expiration == null) {
            return false;
        }
        if (System.currentTimeMillis() > expiration) {
            blacklist.remove(token);
            return false;
        }
        return true;
    }

    private void cleanUp() {
        long now = System.currentTimeMillis();
        blacklist.entrySet().removeIf(entry -> now > entry.getValue());
    }
}
