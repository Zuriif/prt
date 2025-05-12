package com.auth_service.controller;

import com.auth_service.dto.AuthRequest;
import com.auth_service.dto.AuthResponse;
import com.auth_service.dto.RegisterRequest;
import com.auth_service.dto.RoleUpdateRequest;
import com.auth_service.dto.UpdateProfileRequest;
import com.auth_service.entity.Utilisateur;
import com.auth_service.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {
        return authService.login(request);
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Utilisateur> getAllUsers() {
        return authService.getAllUsers();
    }

    @PutMapping("/users/{userId}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUserRole(
            @PathVariable Long userId,
            @RequestBody RoleUpdateRequest request) {
        authService.updateUserRole(userId, request.getRole());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createUser(@RequestBody RegisterRequest request) {
        authService.createUser(request);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/users/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUser(
            @PathVariable Long userId,
            @RequestBody RegisterRequest request) {
        authService.updateUser(userId, request);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/users/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        authService.deleteUser(userId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/update-profile")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public AuthResponse updateProfile(@RequestBody UpdateProfileRequest req) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        return authService.updateOwnProfile(userEmail, req);
    }
}
