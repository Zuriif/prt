package com.entite_service.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class EntiteDTO {
    private Long id;
    private String name;
    private String description;
    private String type;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 