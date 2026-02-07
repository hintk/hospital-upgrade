package com.pegasus.hospital.controller;

import com.pegasus.hospital.dto.DoctorDTO;
import com.pegasus.hospital.dto.LoginDTO;
import com.pegasus.hospital.entity.Doctor;
import com.pegasus.hospital.entity.Schedule;
import com.pegasus.hospital.service.DoctorService;
import com.pegasus.hospital.service.ScheduleService;
import com.pegasus.hospital.vo.Result;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 医生控制器
 */
@Api(tags = "医生管理")
@RestController
@RequestMapping("/api/doctor")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private ScheduleService scheduleService;

    @ApiOperation("获取所有医生")
    @GetMapping("/list")
    public Result<List<Doctor>> list() {
        return Result.success(doctorService.listAll());
    }

    @ApiOperation("按科室查询医生")
    @GetMapping("/department/{departmentId}")
    public Result<List<Doctor>> listByDepartment(@PathVariable Long departmentId) {
        return Result.success(doctorService.listByDepartmentId(departmentId));
    }

    @ApiOperation("获取医生信息")
    @GetMapping("/{doctorId}")
    public Result<Doctor> getInfo(@PathVariable String doctorId) {
        return Result.success(doctorService.getByDoctorId(doctorId));
    }

    @ApiOperation("获取医生排班")
    @GetMapping("/{doctorId}/schedule")
    public Result<List<Schedule>> getSchedule(@PathVariable String doctorId) {
        return Result.success(scheduleService.listByDoctorId(doctorId));
    }

    @ApiOperation("医生登录")
    @PostMapping("/login")
    public Result<Doctor> login(@RequestBody LoginDTO dto) {
        return Result.success("登录成功", doctorService.login(dto.getUserId(), dto.getPassword()));
    }

    @ApiOperation("添加医生")
    @PostMapping
    public Result<Doctor> add(@Validated @RequestBody DoctorDTO dto) {
        return Result.success("添加成功", doctorService.add(dto));
    }

    @ApiOperation("更新医生信息")
    @PutMapping("/{doctorId}")
    public Result<Doctor> update(@PathVariable String doctorId, @RequestBody DoctorDTO dto) {
        return Result.success("更新成功", doctorService.update(doctorId, dto));
    }

    @ApiOperation("删除医生")
    @DeleteMapping("/{doctorId}")
    public Result<?> delete(@PathVariable String doctorId) {
        doctorService.delete(doctorId);
        return Result.success("删除成功");
    }
}
