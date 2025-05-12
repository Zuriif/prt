package com.auth_service.service.impl;

import com.auth_service.config.JwtUtil;
import com.auth_service.dto.AuthRequest;
import com.auth_service.dto.AuthResponse;
import com.auth_service.dto.RegisterRequest;
import com.auth_service.dto.UpdateProfileRequest;
import com.auth_service.entity.Role;
import com.auth_service.entity.Utilisateur;
import com.auth_service.repository.RoleRepository;
import com.auth_service.repository.UtilisateurRepository;
import com.auth_service.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public AuthResponse register(RegisterRequest request) {
        // Vérifie si l'email existe déjà
        if (utilisateurRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Cet email est déjà utilisé.");
        }

        Role role = roleRepository.findByNom(request.getRole())
                .orElseThrow(() -> new RuntimeException("Le rôle " + request.getRole() + " est introuvable."));

        Utilisateur user = Utilisateur.builder()
                .nom(request.getNom())
                .email(request.getEmail())
                .motDePasse(passwordEncoder.encode(request.getMotDePasse()))
                .role(role)
                .build();

        utilisateurRepository.save(user);

        String token = jwtUtil.generateToken(user);
        return new AuthResponse(token);
    }

    @Override
    public AuthResponse login(AuthRequest request) {
        Utilisateur user = utilisateurRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email ou mot de passe invalide"));

        if (!passwordEncoder.matches(request.getMotDePasse(), user.getMotDePasse())) {
            throw new RuntimeException("Email ou mot de passe invalide");
        }

        String token = jwtUtil.generateToken(user);
        return new AuthResponse(token);
    }

    @Override
    public List<Utilisateur> getAllUsers() {
        return utilisateurRepository.findAll();
    }

    @Override
    public void updateUserRole(Long userId, String role) {
        Utilisateur user = utilisateurRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        Role newRole = roleRepository.findByNom(role)
                .orElseThrow(() -> new RuntimeException("Rôle non trouvé"));

        user.setRole(newRole);
        utilisateurRepository.save(user);
    }

    @Override
    public void createUser(RegisterRequest request) {
        // Vérifie si l'email existe déjà
        if (utilisateurRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Cet email est déjà utilisé.");
        }

        Role role = roleRepository.findByNom(request.getRole())
                .orElseThrow(() -> new RuntimeException("Le rôle " + request.getRole() + " est introuvable."));

        Utilisateur user = Utilisateur.builder()
                .nom(request.getNom())
                .email(request.getEmail())
                .motDePasse(passwordEncoder.encode(request.getMotDePasse()))
                .role(role)
                .build();

        utilisateurRepository.save(user);
    }

    @Override
    public void updateUser(Long userId, RegisterRequest request) {
        Utilisateur user = utilisateurRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Vérifie si le nouvel email est déjà utilisé par un autre utilisateur
        if (!user.getEmail().equals(request.getEmail()) && 
            utilisateurRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Cet email est déjà utilisé.");
        }

        Role role = roleRepository.findByNom(request.getRole())
                .orElseThrow(() -> new RuntimeException("Le rôle " + request.getRole() + " est introuvable."));

        user.setNom(request.getNom());
        user.setEmail(request.getEmail());
        if (request.getMotDePasse() != null && !request.getMotDePasse().isEmpty()) {
            user.setMotDePasse(passwordEncoder.encode(request.getMotDePasse()));
        }
        user.setRole(role);

        utilisateurRepository.save(user);
    }

    @Override
    public void deleteUser(Long userId) {
        if (!utilisateurRepository.existsById(userId)) {
            throw new RuntimeException("Utilisateur non trouvé");
        }
        utilisateurRepository.deleteById(userId);
    }

    @Override
    public AuthResponse updateOwnProfile(String email, UpdateProfileRequest req) {
        Utilisateur user = utilisateurRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Check current password
        if (!passwordEncoder.matches(req.getCurrentPassword(), user.getMotDePasse())) {
            throw new RuntimeException("Mot de passe actuel incorrect");
        }

        // Update name and email if provided
        if (req.getNom() != null && !req.getNom().isEmpty()) user.setNom(req.getNom());
        if (req.getEmail() != null && !req.getEmail().isEmpty()) user.setEmail(req.getEmail());

        // Update password if provided
        if (req.getNewPassword() != null && !req.getNewPassword().isEmpty()) {
            user.setMotDePasse(passwordEncoder.encode(req.getNewPassword()));
        }

        utilisateurRepository.save(user);

        // Return new JWT with updated info
        String token = jwtUtil.generateToken(user);
        return new AuthResponse(token);
    }
}
