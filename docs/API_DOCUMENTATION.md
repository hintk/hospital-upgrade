# 飞马星球医院预约挂号系统 - API接口文档

## 接口规范

### 基础信息
- **Base URL**: `http://localhost:8080/api`
- **数据格式**: JSON
- **字符编码**: UTF-8

### 统一响应格式

```json
{
    "code": 200,          // 状态码：200成功，400参数错误，500服务器错误
    "message": "操作成功", // 提示信息
    "data": {}            // 响应数据
}
```

### 错误码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 参数错误/验证失败 |
| 500 | 服务器内部错误/业务异常 |

---

## 一、科室管理 `/api/department`

### 1.1 获取所有科室

**请求**
```
GET /api/department/list
```

**响应示例**
```json
{
    "code": 200,
    "message": "操作成功",
    "data": [
        {
            "id": 1,
            "name": "内科",
            "description": "诊治内脏疾病，包括呼吸、消化、心血管等系统疾病",
            "createdAt": "2025-12-12T11:35:01",
            "updatedAt": "2025-12-12T11:35:01"
        }
    ]
}
```

### 1.2 根据ID获取科室

**请求**
```
GET /api/department/{id}
```

**参数**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | Long | 是 | 科室ID |

---

## 二、患者管理 `/api/patient`

### 2.1 患者注册

**请求**
```
POST /api/patient/register
Content-Type: application/json
```

**请求体**
```json
{
    "name": "张三",           // 必填，最多20字符
    "password": "123456",     // 必填，不少于4位
    "idCard": "110101199001011234",  // 必填，18位数字身份证号
    "phone": "13800138000",   // 必填，11位手机号
    "gender": "M"             // 必填，M男/F女
}
```

**验证规则**
- 年龄必须满10岁（从身份证号解析）
- 身份证号不能重复注册
- 密码不少于4位

**响应示例**
```json
{
    "code": 200,
    "message": "注册成功",
    "data": {
        "patientId": "1000000004",
        "name": "张三",
        "idCard": "110101199001011234",
        "phone": "13800138000",
        "gender": "M",
        "birthDate": "1990-01-01",
        "status": 1
    }
}
```

**错误响应**
```json
{
    "code": 500,
    "message": "注册失败：年龄必须满10岁",
    "data": null
}
```

### 2.2 患者登录

**请求**
```
POST /api/patient/login
Content-Type: application/json
```

**请求体**
```json
{
    "userId": "1000000001",   // 患者ID（10位）
    "password": "123456",
    "userType": "patient"
}
```

**响应示例**
```json
{
    "code": 200,
    "message": "登录成功",
    "data": {
        "patientId": "1000000001",
        "name": "测试患者A",
        "password": null,      // 密码不返回
        "idCard": "110101199001011234",
        "phone": "13800138001",
        "gender": "M",
        "birthDate": "1990-01-01",
        "status": 1
    }
}
```

### 2.3 获取患者信息

**请求**
```
GET /api/patient/{patientId}
```

### 2.4 修改患者信息

**请求**
```
PUT /api/patient/{patientId}
Content-Type: application/json
```

**请求体**（只传需要修改的字段，ID和身份证号不可修改）
```json
{
    "name": "新姓名",
    "password": "newpwd",
    "phone": "13900139000",
    "gender": "F"
}
```

### 2.5 注销账号

**请求**
```
DELETE /api/patient/{patientId}
```

**响应示例**
```json
{
    "code": 200,
    "message": "账号已注销",
    "data": null
}
```

---

## 三、医生管理 `/api/doctor`

### 3.1 获取所有医生

**请求**
```
GET /api/doctor/list
```

**响应示例**
```json
{
    "code": 200,
    "message": "操作成功",
    "data": [
        {
            "doctorId": "10000001",
            "name": "张三",
            "password": null,
            "departmentId": 1,
            "specialty": "擅长呼吸系统疾病、慢性咳嗽、肺炎的诊治",
            "status": 1,
            "departmentName": "内科"
        }
    ]
}
```

### 3.2 按科室查询医生

**请求**
```
GET /api/doctor/department/{departmentId}
```

### 3.3 获取医生详情

**请求**
```
GET /api/doctor/{doctorId}
```

### 3.4 获取医生排班

**请求**
```
GET /api/doctor/{doctorId}/schedule
```

**响应示例**
```json
{
    "code": 200,
    "message": "操作成功",
    "data": [
        {
            "id": 1,
            "doctorId": "10000001",
            "scheduleDate": "2025-12-12",
            "startTime": "08:00:00",
            "endTime": "12:00:00",
            "maxPatients": 20,
            "currentPatients": 1,
            "status": 1,
            "version": 1,
            "doctorName": "张三",
            "departmentName": "内科"
        }
    ]
}
```

### 3.5 医生登录

**请求**
```
POST /api/doctor/login
Content-Type: application/json
```

**请求体**
```json
{
    "userId": "10000001",
    "password": "123456",
    "userType": "doctor"
}
```

### 3.6 添加医生（管理功能）

**请求**
```
POST /api/doctor
Content-Type: application/json
```

**请求体**
```json
{
    "doctorId": "10000009",   // 可选，不传则自动生成
    "name": "新医生",         // 必填
    "password": "123456",     // 可选，默认123456
    "departmentId": 1,        // 必填
    "specialty": "专长描述"   // 可选
}
```

### 3.7 更新医生信息

**请求**
```
PUT /api/doctor/{doctorId}
Content-Type: application/json
```

### 3.8 删除医生（逻辑删除）

**请求**
```
DELETE /api/doctor/{doctorId}
```

---

## 四、排班管理 `/api/schedule`

### 4.1 按日期查询排班

**请求**
```
GET /api/schedule/date/{date}
```

**参数**
| 参数 | 类型 | 格式 | 说明 |
|------|------|------|------|
| date | String | yyyy-MM-dd | 排班日期 |

**示例**
```
GET /api/schedule/date/2025-12-12
```

### 4.2 按医生查询排班

**请求**
```
GET /api/schedule/doctor/{doctorId}
```

### 4.3 获取排班详情

**请求**
```
GET /api/schedule/{id}
```

### 4.4 添加排班

**请求**
```
POST /api/schedule
Content-Type: application/json
```

**请求体**
```json
{
    "doctorId": "10000001",        // 必填
    "scheduleDate": "2025-12-20",  // 必填，格式yyyy-MM-dd
    "startTime": "08:00",          // 必填，格式HH:mm
    "endTime": "12:00",            // 必填
    "maxPatients": 25              // 可选，默认20
}
```

### 4.5 更新排班

**请求**
```
PUT /api/schedule/{id}
Content-Type: application/json
```

### 4.6 删除排班（停诊）

**请求**
```
DELETE /api/schedule/{id}
```

**注意**：如果该排班已有预约，将无法删除。

---

## 五、预约挂号 `/api/appointment`

### 5.1 创建预约（核心功能）

**请求**
```
POST /api/appointment
Content-Type: application/json
```

**请求体**
```json
{
    "patientId": "1000000001",  // 必填，患者ID
    "doctorId": "10000001",     // 必填，医生ID
    "scheduleId": 1             // 必填，排班ID
}
```

**业务规则**
- 同一患者同一时段只能预约一个号源
- 号源已满时预约失败
- 使用乐观锁控制并发

**响应示例**
```json
{
    "code": 200,
    "message": "预约成功",
    "data": {
        "appointmentId": "000000000001",
        "patientId": "1000000001",
        "doctorId": "10000001",
        "scheduleId": 1,
        "appointmentTime": "2025-12-12T08:00:00",
        "status": "已预约"
    }
}
```

**错误响应**
```json
{
    "code": 500,
    "message": "预约失败：该时段号源已满或已被他人预约，请刷新后重试",
    "data": null
}
```

### 5.2 取消预约

**请求**
```
PUT /api/appointment/{appointmentId}/cancel?reason=取消原因
```

**参数**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| appointmentId | String | 是 | 预约号（12位） |
| reason | String | 否 | 取消原因 |

**业务规则**
- 只有"已预约"状态可以取消
- 距离预约时间不足1小时无法取消
- 取消后自动释放号源

### 5.3 完成预约

**请求**
```
PUT /api/appointment/{appointmentId}/complete
```

### 5.4 获取预约详情

**请求**
```
GET /api/appointment/{appointmentId}
```

### 5.5 获取患者的预约列表

**请求**
```
GET /api/appointment/patient/{patientId}
```

**响应示例**
```json
{
    "code": 200,
    "message": "操作成功",
    "data": [
        {
            "appointmentId": "000000000001",
            "patientId": "1000000001",
            "doctorId": "10000001",
            "scheduleId": 1,
            "appointmentTime": "2025-12-12T08:00:00",
            "status": "已预约",
            "cancelReason": null,
            "patientName": "测试患者A",
            "doctorName": "张三",
            "departmentName": "内科"
        }
    ]
}
```

### 5.6 获取医生的预约列表

**请求**
```
GET /api/appointment/doctor/{doctorId}
```

---

## 六、医院管理 `/api/admin`

### 6.1 管理员登录

**请求**
```
POST /api/admin/login
Content-Type: application/json
```

**请求体**
```json
{
    "userId": "admin",
    "password": "admin123",
    "userType": "admin"
}
```

### 6.2 批量导入医生

**请求**
```
POST /api/admin/import/doctor
Content-Type: multipart/form-data
```

**参数**
| 参数 | 类型 | 说明 |
|------|------|------|
| file | File | Excel文件(.xlsx) |

**Excel格式**
| 医生ID(8位,可空) | 姓名(必填) | 密码(可空) | 科室ID(必填) | 专长描述(可空) |
|-----------------|-----------|-----------|-------------|--------------|
| 10000009 | 新医生 | 123456 | 1 | 擅长... |

**响应示例**
```json
{
    "code": 200,
    "message": "成功导入 5 条医生记录",
    "data": null
}
```

### 6.3 批量导入排班

**请求**
```
POST /api/admin/import/schedule
Content-Type: multipart/form-data
```

**Excel格式**
| 医生ID(必填) | 排班日期(yyyy-MM-dd) | 开始时间(HH:mm) | 结束时间(HH:mm) | 最大预约数 |
|-------------|---------------------|----------------|----------------|-----------|
| 10000001 | 2025-12-20 | 08:00 | 12:00 | 20 |

### 6.4 导出预约记录

**请求**
```
GET /api/admin/export/appointments
```

**响应**: 直接下载Excel文件

### 6.5 生成月度统计报告

**请求**
```
GET /api/admin/report/monthly?year=2025&month=12
```

**参数**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| year | Integer | 否 | 年份，默认当前年 |
| month | Integer | 否 | 月份，默认当前月 |

**响应**: 直接下载PDF文件

**报告内容**
- 各科室预约量统计
- 医生工作量统计

### 6.6 下载医生导入模板

**请求**
```
GET /api/admin/template/doctor
```

### 6.7 下载排班导入模板

**请求**
```
GET /api/admin/template/schedule
```

---

## 七、前端调用示例（Axios）

### 7.1 基础配置

```javascript
// api/index.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// 响应拦截器
api.interceptors.response.use(
    response => {
        const { code, message, data } = response.data;
        if (code === 200) {
            return data;
        }
        return Promise.reject(new Error(message));
    },
    error => {
        return Promise.reject(error);
    }
);

export default api;
```

### 7.2 API封装示例

```javascript
// api/patient.js
import api from './index';

export const patientApi = {
    // 注册
    register: (data) => api.post('/patient/register', data),
    
    // 登录
    login: (userId, password) => api.post('/patient/login', {
        userId,
        password,
        userType: 'patient'
    }),
    
    // 获取信息
    getInfo: (patientId) => api.get(`/patient/${patientId}`),
    
    // 修改信息
    update: (patientId, data) => api.put(`/patient/${patientId}`, data),
    
    // 注销
    cancel: (patientId) => api.delete(`/patient/${patientId}`)
};

// api/appointment.js
export const appointmentApi = {
    // 创建预约
    create: (data) => api.post('/appointment', data),
    
    // 取消预约
    cancel: (appointmentId, reason) => 
        api.put(`/appointment/${appointmentId}/cancel?reason=${encodeURIComponent(reason || '')}`),
    
    // 获取患者预约列表
    getByPatient: (patientId) => api.get(`/appointment/patient/${patientId}`)
};
```

---

## 八、注意事项

### 8.1 并发控制
预约接口使用**乐观锁**控制并发，当多个用户同时预约同一号源时，只有一个会成功，其他会收到"号源已满"的错误提示。

### 8.2 时间格式
- 日期格式：`yyyy-MM-dd`（如：2025-12-12）
- 时间格式：`HH:mm:ss` 或 `HH:mm`（如：08:00:00 或 08:00）
- 日期时间格式：`yyyy-MM-dd HH:mm:ss`（如：2025-12-12 08:00:00）

### 8.3 文件上传
导入Excel文件时使用 `multipart/form-data` 格式，文件参数名为 `file`。

### 8.4 跨域
后端已配置CORS，允许所有来源访问。

