package com.entite_service.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class EntiteMediaDTO {
    private Long id;
    private Long entiteId;
    private String mediaType;
    private String url;
    private String title;
    private String description;
    private boolean isPrimary;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 