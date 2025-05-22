package com.entite_service.repository;

import com.entite_service.entity.EntiteLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EntiteLocationRepository extends JpaRepository<EntiteLocation, Long> {
    EntiteLocation findByEntiteId(Long entiteId);
} 