-- ============================================
-- 飞马星球医院预约挂号系统 数据库初始化脚本
-- Pegasus Hospital Appointment System
-- ============================================

-- 创建数据库
CREATE DATABASE IF NOT EXISTS pegasus_hospital 
    DEFAULT CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci;

USE pegasus_hospital;

-- ============================================
-- 1. 科室表 (Department)
-- ============================================
DROP TABLE IF EXISTS appointment;
DROP TABLE IF EXISTS schedule;
DROP TABLE IF EXISTS doctor;
DROP TABLE IF EXISTS patient;
DROP TABLE IF EXISTS department;

CREATE TABLE department (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '科室ID',
    name VARCHAR(30) NOT NULL UNIQUE COMMENT '科室名称',
    description VARCHAR(200) COMMENT '科室描述',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='科室表';

-- ============================================
-- 2. 患者表 (Patient)
-- 患者ID：10位数字
-- 身份证号：18位
-- 密码：不少于4位
-- ============================================
CREATE TABLE patient (
    patient_id CHAR(10) PRIMARY KEY COMMENT '患者ID，10位数字',
    name VARCHAR(20) NOT NULL COMMENT '姓名，最多20个字符',
    password VARCHAR(64) NOT NULL COMMENT '密码，不少于4位',
    id_card CHAR(18) NOT NULL UNIQUE COMMENT '身份证号，18位数字',
    phone VARCHAR(20) NOT NULL COMMENT '手机号',
    gender ENUM('M', 'F') NOT NULL COMMENT '性别：M男，F女',
    birth_date DATE COMMENT '出生日期（从身份证解析）',
    status TINYINT DEFAULT 1 COMMENT '状态：1正常，0已注销',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_phone (phone),
    INDEX idx_id_card (id_card)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='患者表';

-- ============================================
-- 3. 医生表 (Doctor)
-- 医生ID：8位数字
-- ============================================
CREATE TABLE doctor (
    doctor_id CHAR(8) PRIMARY KEY COMMENT '医生ID，8位数字',
    name VARCHAR(20) NOT NULL COMMENT '姓名，最多20个字符',
    password VARCHAR(64) NOT NULL COMMENT '密码，不少于4位',
    department_id BIGINT NOT NULL COMMENT '科室ID',
    specialty VARCHAR(200) COMMENT '专长描述，最多200个字符',
    status TINYINT DEFAULT 1 COMMENT '状态：1在职，0离职',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    CONSTRAINT fk_doctor_department FOREIGN KEY (department_id) REFERENCES department(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    INDEX idx_department (department_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='医生表';

-- ============================================
-- 4. 排班表 (Schedule)
-- 管理医生的出诊时间和可预约数量
-- ============================================
CREATE TABLE schedule (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '排班ID',
    doctor_id CHAR(8) NOT NULL COMMENT '医生ID',
    schedule_date DATE NOT NULL COMMENT '排班日期',
    start_time TIME NOT NULL COMMENT '开始时间',
    end_time TIME NOT NULL COMMENT '结束时间',
    max_patients INT NOT NULL DEFAULT 20 COMMENT '最大预约数',
    current_patients INT NOT NULL DEFAULT 0 COMMENT '当前已预约数',
    status TINYINT DEFAULT 1 COMMENT '状态：1可预约，0停诊',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    version INT DEFAULT 0 COMMENT '乐观锁版本号',
    CONSTRAINT fk_schedule_doctor FOREIGN KEY (doctor_id) REFERENCES doctor(doctor_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    UNIQUE KEY uk_doctor_date_time (doctor_id, schedule_date, start_time),
    INDEX idx_schedule_date (schedule_date),
    INDEX idx_doctor_date (doctor_id, schedule_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='排班表';

-- ============================================
-- 5. 预约表 (Appointment)
-- 预约号：12位数字（唯一）
-- 状态：已预约、已取消、已完成
-- ============================================
CREATE TABLE appointment (
    appointment_id CHAR(12) PRIMARY KEY COMMENT '预约号，12位数字',
    patient_id CHAR(10) NOT NULL COMMENT '患者ID',
    doctor_id CHAR(8) NOT NULL COMMENT '医生ID',
    schedule_id BIGINT NOT NULL COMMENT '排班ID',
    appointment_time DATETIME NOT NULL COMMENT '预约时间（精确到分钟）',
    status ENUM('已预约', '已取消', '已完成') NOT NULL DEFAULT '已预约' COMMENT '预约状态',
    cancel_reason VARCHAR(200) COMMENT '取消原因',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    CONSTRAINT fk_appointment_patient FOREIGN KEY (patient_id) REFERENCES patient(patient_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_appointment_doctor FOREIGN KEY (doctor_id) REFERENCES doctor(doctor_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_appointment_schedule FOREIGN KEY (schedule_id) REFERENCES schedule(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    INDEX idx_patient (patient_id),
    INDEX idx_doctor (doctor_id),
    INDEX idx_schedule (schedule_id),
    INDEX idx_appointment_time (appointment_time),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='预约表';

-- ============================================
-- 6. 管理员表 (Admin) - 用于医院管理功能
-- ============================================
CREATE TABLE admin (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '管理员ID',
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    password VARCHAR(64) NOT NULL COMMENT '密码',
    name VARCHAR(20) COMMENT '姓名',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='管理员表';

-- ============================================
-- 初始化数据
-- ============================================

-- 插入默认管理员（密码: admin123）
INSERT INTO admin (username, password, name) VALUES 
('admin', 'admin123', '系统管理员');

-- 插入科室数据
INSERT INTO department (name, description) VALUES 
('内科', '诊治内脏疾病，包括呼吸、消化、心血管等系统疾病'),
('外科', '通过手术治疗各种外伤和疾病'),
('儿科', '专门诊治儿童疾病'),
('妇产科', '诊治妇科疾病和产前产后护理'),
('眼科', '诊治眼部疾病'),
('耳鼻喉科', '诊治耳、鼻、咽喉疾病'),
('口腔科', '诊治口腔疾病'),
('皮肤科', '诊治皮肤相关疾病'),
('骨科', '诊治骨骼、关节疾病'),
('神经内科', '诊治神经系统疾病');

-- 插入测试医生数据（密码: 123456）
INSERT INTO doctor (doctor_id, name, password, department_id, specialty) VALUES 
('10000001', '张三', '123456', 1, '擅长呼吸系统疾病、慢性咳嗽、肺炎的诊治'),
('10000002', '李四', '123456', 1, '擅长消化系统疾病、胃肠道疾病的诊治'),
('10000003', '王五', '123456', 2, '擅长普外科手术、腹腔镜微创手术'),
('10000004', '赵六', '123456', 3, '擅长儿童常见病、新生儿疾病的诊治'),
('10000005', '钱七', '123456', 4, '擅长妇科炎症、月经不调的诊治'),
('10000006', '孙八', '123456', 5, '擅长白内障、青光眼的诊治'),
('10000007', '周九', '123456', 6, '擅长鼻炎、中耳炎的诊治'),
('10000008', '吴十', '123456', 9, '擅长骨折、关节置换手术');

-- 插入测试排班数据（未来7天）
INSERT INTO schedule (doctor_id, schedule_date, start_time, end_time, max_patients) VALUES 
-- 张三的排班
('10000001', CURDATE(), '08:00:00', '12:00:00', 20),
('10000001', CURDATE(), '14:00:00', '17:30:00', 15),
('10000001', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '08:00:00', '12:00:00', 20),
('10000001', DATE_ADD(CURDATE(), INTERVAL 2 DAY), '14:00:00', '17:30:00', 15),
-- 李四的排班
('10000002', CURDATE(), '08:00:00', '12:00:00', 20),
('10000002', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '14:00:00', '17:30:00', 15),
('10000002', DATE_ADD(CURDATE(), INTERVAL 3 DAY), '08:00:00', '12:00:00', 20),
-- 王五的排班
('10000003', CURDATE(), '08:00:00', '12:00:00', 10),
('10000003', DATE_ADD(CURDATE(), INTERVAL 2 DAY), '08:00:00', '12:00:00', 10),
('10000003', DATE_ADD(CURDATE(), INTERVAL 4 DAY), '14:00:00', '17:30:00', 10),
-- 赵六的排班
('10000004', CURDATE(), '08:00:00', '12:00:00', 25),
('10000004', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '08:00:00', '12:00:00', 25),
('10000004', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '14:00:00', '17:30:00', 20);

-- 插入测试患者数据（密码: 123456）
-- 身份证号示例：110101199001011234（需要年满10岁）
INSERT INTO patient (patient_id, name, password, id_card, phone, gender, birth_date) VALUES 
('1000000001', '测试患者A', '123456', '110101199001011234', '13800138001', 'M', '1990-01-01'),
('1000000002', '测试患者B', '123456', '110101199502022345', '13800138002', 'F', '1995-02-02');

