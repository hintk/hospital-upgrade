package com.pegasus.hospital.util;

/**
 * ID生成工具类
 */
public class IdGenerator {

    /**
     * 生成患者ID（10位数字）
     */
    public static String generatePatientId(Long maxId) {
        long nextId = (maxId == null) ? 1000000001L : maxId + 1;
        return String.format("%010d", nextId);
    }

    /**
     * 生成医生ID（8位数字）
     */
    public static String generateDoctorId(Long maxId) {
        long nextId = (maxId == null) ? 10000001L : maxId + 1;
        return String.format("%08d", nextId);
    }

    /**
     * 生成预约号（12位数字）
     * 格式：年月日(8位) + 序号(4位)
     */
    public static String generateAppointmentId(Long maxId) {
        long nextId = (maxId == null) ? 1L : maxId + 1;
        return String.format("%012d", nextId);
    }
}
