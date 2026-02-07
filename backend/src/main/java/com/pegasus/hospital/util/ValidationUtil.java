package com.pegasus.hospital.util;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.regex.Pattern;

/**
 * 数据校验工具类
 */
public class ValidationUtil {

    private static final Pattern PATIENT_ID_PATTERN = Pattern.compile("^\\d{10}$");
    private static final Pattern DOCTOR_ID_PATTERN = Pattern.compile("^\\d{8}$");
    private static final Pattern ID_CARD_PATTERN = Pattern.compile("^\\d{18}$");
    private static final Pattern PHONE_PATTERN = Pattern.compile("^1[3-9]\\d{9}$");
    private static final Pattern APPOINTMENT_ID_PATTERN = Pattern.compile("^\\d{12}$");

    /**
     * 验证患者ID格式（10位数字）
     */
    public static boolean isValidPatientId(String patientId) {
        return patientId != null && PATIENT_ID_PATTERN.matcher(patientId).matches();
    }

    /**
     * 验证医生ID格式（8位数字）
     */
    public static boolean isValidDoctorId(String doctorId) {
        return doctorId != null && DOCTOR_ID_PATTERN.matcher(doctorId).matches();
    }

    /**
     * 验证身份证号格式（18位数字）
     */
    public static boolean isValidIdCard(String idCard) {
        return idCard != null && ID_CARD_PATTERN.matcher(idCard).matches();
    }

    /**
     * 验证手机号格式
     */
    public static boolean isValidPhone(String phone) {
        return phone != null && PHONE_PATTERN.matcher(phone).matches();
    }

    /**
     * 验证预约号格式（12位数字）
     */
    public static boolean isValidAppointmentId(String appointmentId) {
        return appointmentId != null && APPOINTMENT_ID_PATTERN.matcher(appointmentId).matches();
    }

    /**
     * 从身份证号解析出生日期
     */
    public static LocalDate parseBirthDateFromIdCard(String idCard) {
        if (!isValidIdCard(idCard)) {
            return null;
        }
        String birthStr = idCard.substring(6, 14);
        return LocalDate.parse(birthStr, DateTimeFormatter.ofPattern("yyyyMMdd"));
    }

    /**
     * 从身份证号计算年龄
     */
    public static int calculateAgeFromIdCard(String idCard) {
        LocalDate birthDate = parseBirthDateFromIdCard(idCard);
        if (birthDate == null) {
            return -1;
        }
        return (int) ChronoUnit.YEARS.between(birthDate, LocalDate.now());
    }

    /**
     * 验证是否年满10岁（根据题目要求）
     */
    public static boolean isOldEnough(String idCard) {
        int age = calculateAgeFromIdCard(idCard);
        return age >= 10;
    }

    /**
     * 验证密码长度（不少于4位）
     */
    public static boolean isValidPassword(String password) {
        return password != null && password.length() >= 4;
    }
}
