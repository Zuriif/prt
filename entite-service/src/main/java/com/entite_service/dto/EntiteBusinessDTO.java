package com.entite_service.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class EntiteBusinessDTO {
    private Long id;
    private Long entiteId;
    private String businessName;
    private String businessType;
    private String registrationNumber;
    private String taxNumber;
    private String industry;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 