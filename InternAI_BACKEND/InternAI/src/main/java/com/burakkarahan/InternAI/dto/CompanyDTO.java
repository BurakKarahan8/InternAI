package com.burakkarahan.InternAI.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CompanyDTO {
    private String companyName;
    private String companyUsername;
    private String companyEmail;
    private String companyPhone;
    private String companyAddress;
}

