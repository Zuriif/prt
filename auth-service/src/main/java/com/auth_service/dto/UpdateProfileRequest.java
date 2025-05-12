package com.auth_service.dto;
import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String nom;
    private String email;
    private String currentPassword;
    private String newPassword;
} 