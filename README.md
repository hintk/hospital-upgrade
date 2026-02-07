# 飞马星球医院预约挂号系统

## 一、项目概述

### 1.1 项目背景
在飞马星球上，随着人口的增长和健康意识的提升，飞马星球医院成为了飞马人就医的主要场所。为了优化医疗资源分配，提高就医效率，飞马星球医院决定开发一套预约挂号系统。

### 1.2 技术架构
本项目采用 **B/S架构（模式三）**，前后端分离开发：

```
┌─────────────────────────────────────────────────────────────────────┐
│                           用户浏览器                                 │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ HTTP/HTTPS
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     前端 (React + Vite)                             │
│           Ant Design 5 + TailwindCSS + React Router 6               │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ RESTful API (JSON)
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   后端 (Spring Boot 2.7)                            │
│         MyBatis-Plus + Apache POI + iText7 + Knife4j                │
│                   Spring Security (JWT) + Actuator                  │
│                   内嵌Tomcat（多线程处理）                            │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ JDBC
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        MySQL 8.0 数据库                              │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.3 技术栈

| 层次 | 技术 |
|------|------|
| 前端框架 | React 18 + Vite |
| UI组件库 | Ant Design 5 |
| 样式 | TailwindCSS |
| 路由 | React Router 6 |
| HTTP客户端 | Axios |
| 后端框架 | Spring Boot 2.7.18 |
| ORM框架 | MyBatis-Plus 3.5.3 |
| 数据库 | MySQL 8.0 |
| Excel处理 | Apache POI 5.2.3 |
| PDF生成 | iText 7.2.5 |
| API文档 | Knife4j (Swagger) |
| 安全框架 | Spring Security + JWT |
| 监控系统 | Prometheus + Grafana |
| E2E测试 | Playwright |


---

## 二、作业要求与评分标准

### 2.1 功能要求（70分）

| 功能模块 | 分值 | 实现状态 |
|---------|------|----------|
| 患者注册（年满10岁验证） | 10分 | ✅ 已实现 |
| 科室和医生查询 | 10分 | ✅ 已实现 |
| 预约和取消挂号 | 10分 | ✅ 已实现 |
| 信息修改 | 10分 | ✅ 已实现 |
| 医生信息和排班管理 | 10分 | ✅ 已实现 |
| 批量导入XLS | 10分 | ✅ 已实现 |
| 导出预约记录和生成统计报告 | 10分 | ✅ 已实现 |

### 2.2 技术要求（20分）

| 技术要求 | 分值 | 实现方式 |
|---------|------|----------|
| 数据库技术 | 5分 | MySQL + MyBatis-Plus |
| 面向对象设计 | 5分 | 分层架构、Entity/DTO/VO |
| 网络服务端程序 | 5分 | Spring Boot + Tomcat |
| 多线程技术 | 5分 | Tomcat线程池 + 乐观锁 |

### 2.3 代码规范（10分）
- 逻辑清晰、代码规范、注释得当

---

## 三、数据库设计

### 3.1 ER图

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│  department  │       │    doctor    │       │   schedule   │
│──────────────│       │──────────────│       │──────────────│
│ id (PK)      │◄──────│ department_id│       │ id (PK)      │
│ name         │       │ doctor_id(PK)│◄──────│ doctor_id    │
│ description  │       │ name         │       │ schedule_date│
└──────────────┘       │ password     │       │ start_time   │
                       │ specialty    │       │ end_time     │
                       └──────────────┘       │ max_patients │
                              │               │ current_patients│
                              │               │ version(乐观锁)│
                              │               └───────┬────────┘
                              │                       │
                              ▼                       ▼
┌──────────────┐       ┌──────────────────────────────┐
│   patient    │       │         appointment          │
│──────────────│       │──────────────────────────────│
│patient_id(PK)│◄──────│ patient_id                   │
│ name         │       │ doctor_id                    │
│ password     │       │ schedule_id                  │
│ id_card      │       │ appointment_id (PK)          │
│ phone        │       │ appointment_time             │
│ gender       │       │ status (已预约/已取消/已完成) │
└──────────────┘       └──────────────────────────────┘
```

### 3.2 数据字段规范

**患者信息：**
- 患者ID：10位数字
- 姓名：最多20个字符
- 密码：不少于4位
- 身份证号：18位数字
- 手机号：11位手机号
- 性别：M(男) 或 F(女)

**医生信息：**
- 医生ID：8位数字
- 姓名：最多20个字符
- 密码：不少于4位
- 科室：最多30个字符
- 专长描述：最多200个字符

**预约信息：**
- 预约号：12位数字（唯一）
- 预约时间段：具体到分钟
- 状态：已预约、已取消、已完成

---

## 四、项目结构

```
pegasus-hospital/
├── backend/                          # 后端项目
│   ├── pom.xml                       # Maven依赖
│   ├── docker-compose-monitoring.yml # 监控栈配置
│   ├── prometheus.yml                # Prometheus配置
│   ├── sql/
│   │   └── init.sql                  # 数据库初始化脚本
│   └── src/main/java/com/pegasus/hospital/
│       ├── HospitalApplication.java  # 启动类
│       ├── config/                   # 配置类
│       ├── controller/               # REST API控制器
│       ├── service/                  # 业务逻辑层
│       ├── mapper/                   # 数据访问层
│       ├── entity/                   # 实体类
│       ├── dto/                      # 数据传输对象
│       ├── vo/                       # 视图对象
│       ├── util/                     # 工具类
│       └── exception/                # 异常处理
├── frontend/                         # 前端项目（待开发）
└── README.md                         # 本文档
```

---

## 五、启动说明

### 5.1 环境要求
- JDK 17+
- Maven 3.8+
- MySQL 8.0+
- Node.js 18+ (前端)

### 5.2 后端启动

```bash
# 1. 启动MySQL并创建数据库
sudo mysql < backend/sql/init.sql

# 2. 启动监控栈 (可选)
# 需在 backend 目录下执行
docker-compose -f ../docker-compose-monitoring.yml up -d

# 3. 启动后端服务
cd backend
mvn spring-boot:run

# 服务地址: http://localhost:8080
# API文档: http://localhost:8080/doc.html
# 监控面板: http://localhost:3000 (Grafana)
```

### 5.3 前端启动（待开发）

```bash
cd frontend
npm install
npm run dev

# 服务地址: http://localhost:5173
```

---

## 六、测试账号

| 角色 | 账号 | 密码 |
|------|------|------|
| 管理员 | admin | admin123 |
| 患者 | 1000000001 | 123456 |
| 医生 | 10000001 | 123456 |

---

## 七、近期更新 (v1.1.0)
*   **安全升级**：全面启用 BCrypt 密码加密与 JWT 认证。
*   **全链路监控**：集成 Prometheus + Grafana 监控体系。
*   **自动化测试**：引入 Playwright 端到端测试框架。
*   **性能优化**：核心业务表索引优化。


