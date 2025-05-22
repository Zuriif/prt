package com.entite_service.repository;

import com.entite_service.entity.EntiteAdditional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EntiteAdditionalRepository extends JpaRepository<EntiteAdditional, Long> {
    EntiteAdditional findByEntiteId(Long entiteId);
} 