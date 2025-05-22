package com.entite_service.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class EntiteContactDTO {
    private Long id;
    private Long entiteId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String position;
    private String department;
    private boolean isPrimary;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 