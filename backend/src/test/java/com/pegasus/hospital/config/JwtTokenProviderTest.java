package com.pegasus.hospital.config;

import com.pegasus.hospital.dto.TokenResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class JwtTokenProviderTest {

    private JwtTokenProvider jwtTokenProvider;

    @BeforeEach
    void setUp() {
        jwtTokenProvider = new JwtTokenProvider();
    }

    @Test
    void testGenerateToken() {
        String userId = "testUser";
        String role = "admin";
        TokenResponse response = jwtTokenProvider.generateToken(userId, role);

        assertNotNull(response.getAccessToken());
        assertNotNull(response.getRefreshToken());
        assertTrue(response.getAccessToken().length() > 0);
        assertTrue(response.getRefreshToken().length() > 0);
    }

    @Test
    void testValidateToken() {
        String userId = "testUser";
        String role = "patient";
        TokenResponse response = jwtTokenProvider.generateToken(userId, role);

        assertTrue(jwtTokenProvider.validateToken(response.getAccessToken()));
        assertTrue(jwtTokenProvider.validateToken(response.getRefreshToken()));
    }

    @Test
    void testGetUserIdFromToken() {
        String userId = "testUser123";
        String role = "admin";
        TokenResponse response = jwtTokenProvider.generateToken(userId, role);

        String extractedUserId = jwtTokenProvider.getUserIdFromToken(response.getAccessToken());
        assertEquals(userId, extractedUserId);
    }

    @Test
    void testGetUserRoleFromToken() {
        String userId = "testUser";
        String role = "doctor";
        TokenResponse response = jwtTokenProvider.generateToken(userId, role);

        String extractedRole = jwtTokenProvider.getUserRoleFromToken(response.getAccessToken());
        assertEquals(role, extractedRole);
    }

    @Test
    void testInvalidToken() {
        String invalidToken = "invalid.token.string";
        assertFalse(jwtTokenProvider.validateToken(invalidToken));
    }
}
