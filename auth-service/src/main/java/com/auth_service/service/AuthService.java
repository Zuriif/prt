package com.auth_service.service;

import com.auth_service.dto.AuthRequest;
import com.auth_service.dto.AuthResponse;
import com.auth_service.dto.RegisterRequest;
import com.auth_service.dto.UpdateProfileRequest;
import com.auth_service.entity.Utilisateur;

import java.util.List;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(AuthRequest request);
    List<Utilisateur> getAllUsers();
    void updateUserRole(Long userId, String role);
    void createUser(RegisterRequest request);
    void updateUser(Long userId, RegisterRequest request);
    void deleteUser(Long userId);
    AuthResponse updateOwnProfile(String email, UpdateProfileRequest req);
}
