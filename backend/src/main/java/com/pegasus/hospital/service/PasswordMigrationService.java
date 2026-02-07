package com.pegasus.hospital.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.pegasus.hospital.entity.Admin;
import com.pegasus.hospital.entity.Doctor;
import com.pegasus.hospital.entity.Patient;
import com.pegasus.hospital.mapper.AdminMapper;
import com.pegasus.hospital.mapper.DoctorMapper;
import com.pegasus.hospital.mapper.PatientMapper;
import com.pegasus.hospital.util.PasswordEncoder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
public class PasswordMigrationService {

    @Autowired
    private PatientMapper patientMapper;

    @Autowired
    private DoctorMapper doctorMapper;

    @Autowired
    private AdminMapper adminMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public void migratePasswordsToBcrypt() {
        log.info("Starting password migration...");
        int patientCount = migratePatients();
        int doctorCount = migrateDoctors();
        int adminCount = migrateAdmins();
        log.info("Password migration completed. Patients: {}, Doctors: {}, Admins: {}", 
                patientCount, doctorCount, adminCount);
    }

    private int migratePatients() {
        int count = 0;
        List<Patient> patients = patientMapper.selectList(null);
        for (Patient patient : patients) {
            String pwd = patient.getPassword();
            if (shouldEncode(pwd)) {
                patient.setPassword(passwordEncoder.encodePassword(pwd));
                patientMapper.updateById(patient);
                count++;
            }
        }
        return count;
    }

    private int migrateDoctors() {
        int count = 0;
        List<Doctor> doctors = doctorMapper.selectList(null);
        for (Doctor doctor : doctors) {
            String pwd = doctor.getPassword();
            if (shouldEncode(pwd)) {
                doctor.setPassword(passwordEncoder.encodePassword(pwd));
                doctorMapper.updateById(doctor);
                count++;
            }
        }
        return count;
    }

    private int migrateAdmins() {
        int count = 0;
        List<Admin> admins = adminMapper.selectList(new LambdaQueryWrapper<>()); // AdminMapper might not extend BaseMapper directly but Mybatis-plus usually does. Checking controller it uses LambdaQueryWrapper so it should be fine.
        for (Admin admin : admins) {
            String pwd = admin.getPassword();
            if (shouldEncode(pwd)) {
                admin.setPassword(passwordEncoder.encodePassword(pwd));
                adminMapper.updateById(admin);
                count++;
            }
        }
        return count;
    }

    private boolean shouldEncode(String password) {
        // Simple check: Bcrypt hashes start with $2a$, $2b$, or $2y$ and are 60 chars long
        return password != null && !password.startsWith("$2");
    }
}
