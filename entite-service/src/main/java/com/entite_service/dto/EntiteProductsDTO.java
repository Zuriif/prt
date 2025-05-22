package com.entite_service.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class EntiteProductsDTO {
    private Long id;
    private Long entiteId;
    private String productName;
    private String productType;
    private String description;
    private Double price;
    private String currency;
    private boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 