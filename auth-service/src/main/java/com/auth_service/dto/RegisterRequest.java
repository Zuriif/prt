package com.auth_service.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String nom;
    private String email;
    private String motDePasse;
    private String role; // ADMIN ou USER
}
