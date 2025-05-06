package com.auth_service.config;

import com.auth_service.entity.Role;
import com.auth_service.entity.Utilisateur;
import com.auth_service.repository.RoleRepository;
import com.auth_service.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final RoleRepository roleRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initRolesAndAdmin() {
        return args -> {
            // Créer les rôles s’ils n’existent pas
            if (roleRepository.findByNom("ADMIN").isEmpty()) {
                roleRepository.save(new Role(null, "ADMIN"));
            }
            if (roleRepository.findByNom("USER").isEmpty()) {
                roleRepository.save(new Role(null, "USER"));
            }

            // Créer un admin s’il n’existe pas
            if (utilisateurRepository.findByEmail("admin@example.com").isEmpty()) {
                Role adminRole = roleRepository.findByNom("ADMIN").get();

                Utilisateur admin = Utilisateur.builder()
                        .nom("Super Admin")
                        .email("admin@example.com")
                        .motDePasse(passwordEncoder.encode("admin123"))
                        .role(adminRole)
                        .build();

                utilisateurRepository.save(admin);
                System.out.println("🛡️ Admin par défaut créé : admin@example.com / admin123");
            }
        };
    }
}
