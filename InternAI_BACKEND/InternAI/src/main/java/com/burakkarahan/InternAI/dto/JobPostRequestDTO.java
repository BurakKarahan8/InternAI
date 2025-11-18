package com.burakkarahan.InternAI.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class JobPostRequestDTO {
    private UUID id;
    private String title;
    private String companyName;
    private String description;
    private String technologies;
    private String city;
    private String country;
    private LocalDate deadline;
    private UUID companyId;
}

