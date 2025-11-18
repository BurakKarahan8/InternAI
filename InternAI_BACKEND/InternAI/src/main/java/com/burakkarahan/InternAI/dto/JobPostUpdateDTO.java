package com.burakkarahan.InternAI.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobPostUpdateDTO {
    private String title;
    private String description;
    private String technologies;
    private String city;
    private String country;
    private LocalDate deadline;
}

