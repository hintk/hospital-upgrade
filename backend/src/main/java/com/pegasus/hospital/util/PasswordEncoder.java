package com.pegasus.hospital.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * 密码加密工具类
 */
@Component
public class PasswordEncoder {

    private final BCryptPasswordEncoder encoder;

    public PasswordEncoder() {
        // cost 12 表示 2^12 轮的加密迭代，强度与速度的平衡
        this.encoder = new BCryptPasswordEncoder(12);
    }

    // 加密密码
    public String encodePassword(String rawPassword) {
        return encoder.encode(rawPassword);
    }

    // 验证密码
    public boolean matches(String rawPassword, String encodedPassword) {
        if (encodedPassword == null || encodedPassword.isEmpty()) {
            return false;
        }
        return encoder.matches(rawPassword, encodedPassword);
    }
}
