package com.pegasus.hospital.controller;

import com.pegasus.hospital.dto.DoctorDTO;
import com.pegasus.hospital.dto.LoginDTO;
import com.pegasus.hospital.dto.ScheduleDTO;
import com.pegasus.hospital.entity.Admin;
import com.pegasus.hospital.entity.Appointment;
import com.pegasus.hospital.exception.BusinessException;
import com.pegasus.hospital.mapper.AdminMapper;
import com.pegasus.hospital.mapper.AppointmentMapper;
import com.pegasus.hospital.service.DoctorService;
import com.pegasus.hospital.service.ExcelService;
import com.pegasus.hospital.service.ReportService;
import com.pegasus.hospital.service.ScheduleService;
import com.pegasus.hospital.vo.Result;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;

/**
 * 管理员控制器
 * 包含导入导出和报告生成功能
 */
@Api(tags = "医院管理")
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminMapper adminMapper;

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private ScheduleService scheduleService;

    @Autowired
    private ExcelService excelService;

    @Autowired
    private ReportService reportService;

    @Autowired
    private AppointmentMapper appointmentMapper;

    @Autowired
    private com.pegasus.hospital.config.JwtTokenProvider tokenProvider;

    @Autowired
    private com.pegasus.hospital.util.PasswordEncoder passwordEncoder;

    @ApiOperation("管理员登录")
    @PostMapping("/login")
    public Result<com.pegasus.hospital.dto.TokenResponse> login(@RequestBody LoginDTO dto) {
        LambdaQueryWrapper<Admin> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Admin::getUsername, dto.getUserId());
        Admin admin = adminMapper.selectOne(wrapper);
        if (admin == null) {
            throw new BusinessException("用户名不存在");
        }
        
        if (!passwordEncoder.matches(dto.getPassword(), admin.getPassword())) {
            throw new BusinessException("密码错误");
        }
        
        com.pegasus.hospital.dto.TokenResponse tokens = tokenProvider.generateToken(admin.getUsername(), "admin");
        return Result.success("登录成功", tokens);
    }

    @ApiOperation("批量导入医生")
    @PostMapping("/import/doctor")
    public Result<?> importDoctors(@RequestParam("file") MultipartFile file) {
        List<DoctorDTO> doctors = excelService.importDoctors(file);
        int success = 0;
        var result = new com.pegasus.hospital.vo.ImportResult();
        result.setTotal(doctors.size());
        for (DoctorDTO dto : doctors) {
            try {
                doctorService.add(dto);
                success++;
            } catch (Exception e) {
                result.getErrors().add((dto.getName() != null ? dto.getName() : "未命名") + ": " + e.getMessage());
            }
        }
        result.setSuccess(success);
        result.setFailed(result.getTotal() - success);
        return Result.success("成功导入 " + success + " 条医生记录", result);
    }

    @ApiOperation("批量导入排班")
    @PostMapping("/import/schedule")
    public Result<?> importSchedules(@RequestParam("file") MultipartFile file) {
        List<ScheduleDTO> schedules = excelService.importSchedules(file);
        int count = scheduleService.batchAdd(schedules);
        return Result.success("成功导入 " + count + " 条排班记录");
    }

    @ApiOperation("导出预约记录")
    @GetMapping("/export/appointments")
    public void exportAppointments(HttpServletResponse response) {
        // 获取所有预约记录（带关联信息）
        List<Appointment> appointments = appointmentMapper.selectByTimeRange(
                LocalDateTime.of(2020, 1, 1, 0, 0),
                LocalDateTime.now()
        );
        excelService.exportAppointments(appointments, response);
    }

    @ApiOperation("生成月度统计报告")
    @GetMapping("/report/monthly")
    public void generateMonthlyReport(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month,
            HttpServletResponse response) {
        // 默认为当前月
        if (year == null || month == null) {
            YearMonth now = YearMonth.now();
            year = now.getYear();
            month = now.getMonthValue();
        }
        reportService.generateMonthlyReport(year, month, response);
    }

    @ApiOperation("下载医生导入模板")
    @GetMapping("/template/doctor")
    public void downloadDoctorTemplate(HttpServletResponse response) {
        excelService.downloadDoctorTemplate(response);
    }

    @ApiOperation("下载排班导入模板")
    @GetMapping("/template/schedule")
    public void downloadScheduleTemplate(HttpServletResponse response) {
        excelService.downloadScheduleTemplate(response);
    }
}
