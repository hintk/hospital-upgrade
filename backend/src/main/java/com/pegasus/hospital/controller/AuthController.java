package com.pegasus.hospital.controller;

import com.pegasus.hospital.config.JwtTokenProvider;
import com.pegasus.hospital.dto.TokenResponse;
import com.pegasus.hospital.service.TokenBlacklistService;
import com.pegasus.hospital.vo.Result;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.Map;

@Api(tags = "认证管理")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final JwtTokenProvider tokenProvider;
    private final TokenBlacklistService tokenBlacklistService;

    public AuthController(JwtTokenProvider tokenProvider, TokenBlacklistService tokenBlacklistService) {
        this.tokenProvider = tokenProvider;
        this.tokenBlacklistService = tokenBlacklistService;
    }

    @ApiOperation("刷新Token")
    @PostMapping("/refresh")
    public Result<TokenResponse> refreshToken(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        if (!StringUtils.hasText(refreshToken) || !tokenProvider.validateToken(refreshToken)) {
            return Result.error("Invalid Refresh Token");
        }
        
        // Ensure it's a refresh token? (Optional: adding a claim typ=refresh)
        
        String userId = tokenProvider.getUserIdFromToken(refreshToken);
        String role = tokenProvider.getUserRoleFromToken(refreshToken);
        
        TokenResponse tokens = tokenProvider.generateToken(userId, role);
        return Result.success(tokens);
    }

    @ApiOperation("退出登录")
    @PostMapping("/logout")
    public Result<?> logout(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (StringUtils.hasText(token) && token.startsWith("Bearer ")) {
            token = token.substring(7);
            Date expiration = tokenProvider.getExpirationDateFromToken(token);
            tokenBlacklistService.addToBlacklist(token, expiration);
        }
        return Result.success("Logged out successfully");
    }
}
