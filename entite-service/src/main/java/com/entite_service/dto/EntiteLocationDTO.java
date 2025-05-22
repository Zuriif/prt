package com.entite_service.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class EntiteLocationDTO {
    private Long id;
    private Long entiteId;
    private String address;
    private String city;
    private String state;
    private String country;
    private String postalCode;
    private Double latitude;
    private Double longitude;
    private boolean isPrimary;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 