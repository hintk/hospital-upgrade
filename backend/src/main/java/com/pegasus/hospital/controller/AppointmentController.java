package com.pegasus.hospital.controller;

import com.pegasus.hospital.dto.AppointmentCreateDTO;
import com.pegasus.hospital.entity.Appointment;
import com.pegasus.hospital.service.AppointmentService;
import com.pegasus.hospital.vo.Result;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 预约控制器
 */
@Api(tags = "预约挂号")
@RestController
@RequestMapping("/api/appointment")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @ApiOperation("创建预约")
    @PostMapping
    public Result<Appointment> create(@Validated @RequestBody AppointmentCreateDTO dto) {
        return Result.success("预约成功", appointmentService.create(dto));
    }

    @ApiOperation("取消预约")
    @PutMapping("/{appointmentId}/cancel")
    public Result<?> cancel(@PathVariable String appointmentId,
                            @RequestParam(required = false) String reason) {
        appointmentService.cancel(appointmentId, reason);
        return Result.success("取消成功");
    }

    @ApiOperation("完成预约")
    @PutMapping("/{appointmentId}/complete")
    public Result<?> complete(@PathVariable String appointmentId) {
        appointmentService.complete(appointmentId);
        return Result.success("已完成");
    }

    @ApiOperation("获取预约详情")
    @GetMapping("/{appointmentId}")
    public Result<Appointment> getById(@PathVariable String appointmentId) {
        return Result.success(appointmentService.getByAppointmentId(appointmentId));
    }

    @ApiOperation("获取患者的预约列表")
    @GetMapping("/patient/{patientId}")
    public Result<List<Appointment>> listByPatient(@PathVariable String patientId) {
        return Result.success(appointmentService.listByPatientId(patientId));
    }

    @ApiOperation("获取医生的预约列表")
    @GetMapping("/doctor/{doctorId}")
    public Result<List<Appointment>> listByDoctor(@PathVariable String doctorId) {
        return Result.success(appointmentService.listByDoctorId(doctorId));
    }
}
