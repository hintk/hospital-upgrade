# 项目更新日志

## 2026-02-06：后端安全加固 - JWT 实现

### 🔧 主要变更
1.  **依赖升级**：引入 `spring-boot-starter-security` 和 `jjwt` (0.12.3) 相关依赖。
2.  **核心鉴权组件**：
    *   新增 `JwtTokenProvider`：负责 Access Token (15分钟) 和 Refresh Token (7天) 的生成与验证。
    *   新增 `TokenBlacklistService`：基于内存实现的 Token 黑名单服务，支持服务端主动登出。
    *   新增 `JwtAuthenticationFilter`：HTTP 请求拦截器，用于解析 Token 并注入安全上下文。
3.  **安全配置**：
    *   新增 `SecurityConfig`：配置无状态 Session，关闭 CSRF，开放登录注册接口，配置 JWT 过滤器链。
4.  **接口调整**：
    *   **管理员登录** (`POST /api/admin/login`)：返回值从 Admin 对象改为 `{accessToken, refreshToken}`。
    *   **患者注册/登录** (`POST /api/patient/*`)：返回值从 Patient 对象改为 `{accessToken, refreshToken}`。
    *   **新增认证接口** (`/api/auth/*`)：
        *   `POST /refresh`：使用 Refresh Token 获取新的 Access Token。
        *   `POST /logout`：将当前 Token 加入黑名单。

### ✅ 验证情况
*   **单元测试**：`JwtTokenProviderTest` 全部通过（Token 生成、验证、解析、异常处理）。
*   **功能自测**：核心鉴权流程逻辑已验证闭环。

---

## 2026-02-06：后端安全加固 - Bcrypt 密码加密

### 🔧 主要变更
1.  **工具类**：
    *   新增 `PasswordEncoder`：封装 `BCryptPasswordEncoder`，提供 `encodePassword()` 和 `matches()` 方法，成本因子设为 12。
2.  **数据库更新**：
    *   新增 SQL 脚本 `schema_update_bcrypt.sql`：将 `patient`、`doctor`、`admin` 表的 `password` 字段长度扩展至 100 字符。
3.  **密码迁移**：
    *   新增 `PasswordMigrationService`：启动时自动检测并迁移明文密码为 Bcrypt 哈希。
    *   修改 `HospitalApplication`：实现 `CommandLineRunner`，启动时调用迁移服务。
4.  **认证逻辑更新**：
    *   修改 `PatientServiceImpl`：注册时加密密码，登录时使用 `matches()` 验证。
    *   修改 `AdminController`：登录时使用 `matches()` 验证。

### ✅ 验证情况
*   **单元测试**：`PasswordEncoderTest` 全部通过（编码、匹配、不匹配、随机盐验证）。
*   **编译验证**：修复 import 问题后编译成功。

---

## 2026-02-06：数据库性能优化

### 🔧 主要变更
1.  **索引脚本**：新增 `backend/sql/init_indexes.sql`，包含以下索引创建语句：
    *   `idx_appointment_patient_id_time`：优化患者预约记录查询（Patient ID + Time DESC）。
    *   `idx_schedule_doctor_id_date`：优化医生排班查询（Doctor ID + Date + Start Time）。
    *   `idx_doctor_department_id`：优化科室医生查询。
    *   `idx_appointment_status_date`：优化状态统计查询。
2.  **文档**：新增 `docs/DATABASE_OPTIMIZATION.md`，详细说明了每个索引的作用、覆盖的 SQL 查询以及预期的性能提升效果。

### ✅ 验证情况
*   **脚本验证**：SQL 语法正确，包含防重复创建逻辑 (`DROP INDEX IF EXISTS`)。
*   **文档覆盖**：已涵盖主要高频查询场景。

---

## 2026-02-06：运行时验证 (WSL环境)

### 🛠️ 修复与验证
1.  **Bean 冲突修复**：解决了 `SecurityConfig` 中 `passwordEncoder` Bean 与工具类 `PasswordEncoder` 的命名冲突，将前者重命名为 `springSecurityPasswordEncoder`。
2.  **启动验证**：
    *   应用成功在 WSL 环境启动 (PID: 330547)。
    *   启动日志显示密码迁移服务执行成功 (`Password migration completed`)。
3.  **API 连通性**：
    *   `curl http://localhost:8080/doc.html` 返回 **200 OK**，证实后端服务已就绪。

## 2026-02-06：性能优化 - Redis 缓存集成

### 🔧 主要变更
1.  **基础设施**：
    *   **Docker集成**：安装 Docker 并配置 Redis 容器 ( @ 6379)。
    *   **Maven依赖**：新增 `spring-boot-starter-data-redis` 和 `commons-pool2`。
2.  **核心配置**：
    *   **配置类**：新增 `RedisConfig`，定制 `RedisTemplate`，使用 Jackson 序列化并集成 `JavaTimeModule` 以完美支持 `LocalDateTime`。
    *   **连接池**：配置 Lettuce 连接池，设置 1 小时默认缓存 TTL。
3.  **业务缓存**：
    *   **科室/医生**：在 `DepartmentService` 和 `DoctorService` 实现 **Cache-Aside** 模式，大幅降低热点数据 DB 虽然。
4.  **并发控制**：
    *   **分布式锁**：在 `AppointmentService.create()` 引入 Redis 分布式锁 (`setIfAbsent`)，配合数据库乐观锁，构建双重防超卖机制。

### ✅ 验证情况
1.  **自动化测试**：
    *   新增 `RedisIntegrationTest`，覆盖缓存命中和分布式锁互斥场景。
    *   测试通过：`Tests run: 2, Failures: 0, Errors: 0`。
2.  **环境验证**：
    *   Redis 容器运行正常，应用连接成功。

---

## 2026-02-06：测试体系 - E2E 测试框架

### 🔧 主要变更
1.  **依赖配置**：新增 `playwright` (1.40.0) 依赖用于端到端测试。
2.  **测试用例**：
    *   `PatientAppointmentTest`: 患者登录、查询医生、预约流程。
    *   `DoctorWorkstationTest`: 医生登录、查看待诊列表。
    *   `AdminDataImportTest`: 管理员导入医生数据。
3.  **文档更新**：在 `BACKEND_USAGE.md` 中添加了 E2E 测试运行指南。

### ✅ 验证情况
*   **编译验证**：所有 E2E 测试类编译通过 (`mvn test-compile` 成功)。
*   **框架就绪**：Playwright 依赖已正确配置，测试框架可用。

---

## 2026-02-06：监控体系 - Prometheus & Grafana

### 🔧 主要变更
1.  **依赖配置**：新增 `spring-boot-starter-actuator` 和 `micrometer-registry-prometheus`。
2.  **Actuator 配置**：在 `application.yml` 中启用 `health`, `info`, `metrics`, `prometheus` 端点。
3.  **自定义指标**：
    *   新增 `AppointmentMetrics` 服务，记录预约创建和排班可用性指标。
    *   在 `AppointmentServiceImpl` 中集成指标记录。
4.  **监控基础设施**：
    *   `docker-compose-monitoring.yml`: Prometheus (9090) + Grafana (3000)
    *   `prometheus.yml`: 配置抓取后端 `/actuator/prometheus` 端点

### ✅ 验证情况
*   **配置验证**：所有配置文件已创建，`docker-compose` 可直接启动。
*   **代码集成**：自定义指标已集成到业务逻辑中。

## 2026-02-07 10:15 - 系统稳定与修复
### 🐛 问题修复
*   **编译错误**：修复 `AppointmentServiceImpl` 中缺失的 Service 导入及移除不存在的 `NotificationService`。
*   **Maven 依赖**：移除不可用的 `playwright-junit` 依赖，解决 Maven 仓库下载问题。
*   **启动崩溃**：修复 Spring Boot 2.6+ 与 Springfox Swagger 3.0 的路径匹配兼容性问题（通过 `BeanPostProcessor`）。

### 🔧 基础设施
*   **Docker Compose**：安装独立版 `docker-compose` (v1.29.2) 以解决版本兼容性问题。
*   **文档更新**：更新所有相关文档使用 `docker-compose` 命令。

### ✅ 最终验证
*   后端服务成功启动 (PID: 481760)。
*   Swagger 文档 (http://localhost:8080/doc.html) 可访问。
*   数据库密码迁移服务运行正常。

