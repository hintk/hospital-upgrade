package com.pegasus.hospital.controller;

import com.pegasus.hospital.dto.ScheduleDTO;
import com.pegasus.hospital.entity.Schedule;
import com.pegasus.hospital.service.ScheduleService;
import com.pegasus.hospital.vo.Result;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * 排班控制器
 */
@Api(tags = "排班管理")
@RestController
@RequestMapping("/api/schedule")
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

    @ApiOperation("按日期查询排班")
    @GetMapping("/date/{date}")
    public Result<List<Schedule>> listByDate(
            @PathVariable @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate date) {
        return Result.success(scheduleService.listByDate(date));
    }

    @ApiOperation("按医生查询排班")
    @GetMapping("/doctor/{doctorId}")
    public Result<List<Schedule>> listByDoctor(@PathVariable String doctorId) {
        return Result.success(scheduleService.listByDoctorId(doctorId));
    }

    @ApiOperation("获取排班详情")
    @GetMapping("/{id}")
    public Result<Schedule> getById(@PathVariable Long id) {
        return Result.success(scheduleService.getById(id));
    }

    @ApiOperation("添加排班")
    @PostMapping
    public Result<Schedule> add(@Validated @RequestBody ScheduleDTO dto) {
        return Result.success("添加成功", scheduleService.add(dto));
    }

    @ApiOperation("更新排班")
    @PutMapping("/{id}")
    public Result<Schedule> update(@PathVariable Long id, @RequestBody ScheduleDTO dto) {
        return Result.success("更新成功", scheduleService.update(id, dto));
    }

    @ApiOperation("删除排班（停诊）")
    @DeleteMapping("/{id}")
    public Result<?> delete(@PathVariable Long id) {
        scheduleService.delete(id);
        return Result.success("已停诊");
    }
}
