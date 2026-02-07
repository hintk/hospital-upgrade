package com.pegasus.hospital;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 飞马星球医院预约挂号系统 启动类
 * Pegasus Hospital Appointment System
 */
@SpringBootApplication
@MapperScan("com.pegasus.hospital.mapper")
public class HospitalApplication implements CommandLineRunner {

    @Autowired
    private com.pegasus.hospital.service.PasswordMigrationService migrationService;

    public static void main(String[] args) {
        SpringApplication.run(HospitalApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        migrationService.migratePasswordsToBcrypt();
        System.out.println("============================================");
        System.out.println("  飞马星球医院预约挂号系统启动成功！");
        System.out.println("  API文档: http://localhost:8080/doc.html");
        System.out.println("============================================");
    }
}
