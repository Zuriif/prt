package com.auth_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import com.auth_service.entity.Role;
import com.auth_service.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@SpringBootApplication
public class AuthServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(AuthServiceApplication.class, args);
	}

@Configuration
public class InitRolesConfig {

    @Bean
    public CommandLineRunner initRoles(RoleRepository roleRepository) {
        return args -> {
            if (roleRepository.findByNom("ADMIN").isEmpty()) {
                roleRepository.save(new Role(null, "ADMIN"));
            }
            if (roleRepository.findByNom("USER").isEmpty()) {
                roleRepository.save(new Role(null, "USER"));
            }
        };
    }
}
}