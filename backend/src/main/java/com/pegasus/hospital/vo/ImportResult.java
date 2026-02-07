package com.pegasus.hospital.vo;

import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
public class ImportResult {
    private int total;
    private int success;
    private int failed;
    private List<String> errors = new ArrayList<>();
}

