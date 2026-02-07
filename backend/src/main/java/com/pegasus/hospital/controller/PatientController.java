package com.pegasus.hospital.controller;

import com.pegasus.hospital.dto.LoginDTO;
import com.pegasus.hospital.dto.PatientRegisterDTO;
import com.pegasus.hospital.dto.PatientUpdateDTO;
import com.pegasus.hospital.entity.Patient;
import com.pegasus.hospital.service.PatientService;
import com.pegasus.hospital.vo.Result;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * 患者控制器
 */
@Api(tags = "患者管理")
@RestController
@RequestMapping("/api/patient")
public class PatientController {

    @Autowired
    private PatientService patientService;

    @Autowired
    private com.pegasus.hospital.config.JwtTokenProvider tokenProvider;

    @ApiOperation("患者注册")
    @PostMapping("/register")
    public Result<com.pegasus.hospital.dto.TokenResponse> register(@Validated @RequestBody PatientRegisterDTO dto) {
        Patient patient = patientService.register(dto);
        com.pegasus.hospital.dto.TokenResponse tokens = tokenProvider.generateToken(patient.getPatientId(), "patient");
        return Result.success("注册成功", tokens);
    }

    @ApiOperation("患者登录")
    @PostMapping("/login")
    public Result<com.pegasus.hospital.dto.TokenResponse> login(@RequestBody LoginDTO dto) {
        Patient patient = patientService.login(dto.getUserId(), dto.getPassword());
        com.pegasus.hospital.dto.TokenResponse tokens = tokenProvider.generateToken(patient.getPatientId(), "patient");
        return Result.success("登录成功", tokens);
    }

    @ApiOperation("获取患者信息")
    @GetMapping("/{patientId}")
    public Result<Patient> getInfo(@PathVariable String patientId) {
        return Result.success(patientService.getByPatientId(patientId));
    }

    @ApiOperation("修改患者信息")
    @PutMapping("/{patientId}")
    public Result<Patient> update(@PathVariable String patientId, 
                                   @Validated @RequestBody PatientUpdateDTO dto) {
        return Result.success("修改成功", patientService.update(patientId, dto));
    }

    @ApiOperation("注销账号")
    @DeleteMapping("/{patientId}")
    public Result<?> cancel(@PathVariable String patientId) {
        patientService.cancelAccount(patientId);
        return Result.success("账号已注销");
    }
}
