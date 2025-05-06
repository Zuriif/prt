package com.entite_service.repository;

import com.entite_service.entity.Entite;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EntiteRepository extends JpaRepository<Entite, Long> {
}
