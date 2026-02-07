package com.pegasus.hospital.util;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class PasswordEncoderTest {

    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        passwordEncoder = new PasswordEncoder();
    }

    @Test
    void testPasswordEncoding() {
        String rawPassword = "123456";
        String encoded = passwordEncoder.encodePassword(rawPassword);
        
        assertNotNull(encoded);
        assertNotEquals(rawPassword, encoded);
        assertTrue(encoded.startsWith("$2"), "Encoded password should start with $2");
    }

    @Test
    void testMatches() {
        String rawPassword = "password123";
        String encoded = passwordEncoder.encodePassword(rawPassword);
        
        assertTrue(passwordEncoder.matches(rawPassword, encoded));
    }

    @Test
    void testNotMatches() {
        String rawPassword = "password123";
        String encoded = passwordEncoder.encodePassword(rawPassword);
        
        assertFalse(passwordEncoder.matches("wrongPassword", encoded));
    }

    @Test
    void testMultipleEncodingsAreDifferent() {
        String rawPassword = "samePassword";
        String encoded1 = passwordEncoder.encodePassword(rawPassword);
        String encoded2 = passwordEncoder.encodePassword(rawPassword);
        
        assertNotEquals(encoded1, encoded2, "Bcrypt should produce different hashes for same input (salt)");
        assertTrue(passwordEncoder.matches(rawPassword, encoded1));
        assertTrue(passwordEncoder.matches(rawPassword, encoded2));
    }
}
