package com.auth_service.service.impl;

import com.auth_service.config.JwtUtil;
import com.auth_service.dto.AuthRequest;
import com.auth_service.dto.AuthResponse;
import com.auth_service.dto.RegisterRequest;
import com.auth_service.entity.Role;
import com.auth_service.entity.Utilisateur;
import com.auth_service.repository.RoleRepository;
import com.auth_service.repository.UtilisateurRepository;
import com.auth_service.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
        // Vérifie si l’email existe déjà
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
}
