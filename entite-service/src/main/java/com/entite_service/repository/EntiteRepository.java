package com.entite_service.repository;

import com.entite_service.entity.Entite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EntiteRepository extends JpaRepository<Entite, Long> {
    // Add custom queries if needed
}
