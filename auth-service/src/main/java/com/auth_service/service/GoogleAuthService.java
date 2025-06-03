package com.auth_service.service;

import com.auth_service.entity.Utilisateur;
import com.auth_service.entity.Role;
import com.auth_service.repository.UtilisateurRepository;
import com.auth_service.repository.RoleRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.InitializingBean;

import java.util.Collections;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GoogleAuthService implements InitializingBean {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String clientId;

    private GoogleIdTokenVerifier verifier;

    @Override
    public void afterPropertiesSet() {
        verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                .setAudience(Collections.singletonList(clientId))
                .build();
    }

    public Utilisateur authenticateGoogleUser(String idTokenString) throws Exception {
        try {
            System.out.println("Verifying token with client ID: " + clientId);
            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken == null) {
                throw new Exception("Invalid ID token: Token verification failed");
            }

            Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");

            if (email == null || email.isEmpty()) {
                throw new Exception("Email not found in Google token");
            }

            System.out.println("Token verified successfully for email: " + email);

            Optional<Utilisateur> existingUser = utilisateurRepository.findByEmail(email);
            if (existingUser.isPresent()) {
                Utilisateur user = existingUser.get();
                // Ensure existing user has a role, assign default if null
                if (user.getRole() == null) {
                    Role defaultRole = roleRepository.findByNom("USER")
                            .orElseThrow(() -> new RuntimeException("Default role 'USER' not found"));
                    user.setRole(defaultRole);
                    utilisateurRepository.save(user);
                }
                return user;
            }

            // Create new user if doesn't exist and assign default role
            Role defaultRole = roleRepository.findByNom("USER")
                    .orElseThrow(() -> new RuntimeException("Default role 'USER' not found"));

            Utilisateur newUser = Utilisateur.builder()
                    .email(email)
                    .nom(name)
                    .motDePasse(passwordEncoder.encode(generateRandomPassword()))
                    .role(defaultRole)
                    .build();

            return utilisateurRepository.save(newUser);
        } catch (Exception e) {
            System.err.println("Google authentication error: " + e.getMessage());
            e.printStackTrace();
            throw new Exception("Google authentication failed: " + e.getMessage());
        }
    }

    private String generateRandomPassword() {
        return java.util.UUID.randomUUID().toString();
    }
} 