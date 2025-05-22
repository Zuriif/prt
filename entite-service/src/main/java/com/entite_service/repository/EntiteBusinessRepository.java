package com.entite_service.repository;

import com.entite_service.entity.EntiteBusiness;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EntiteBusinessRepository extends JpaRepository<EntiteBusiness, Long> {
    EntiteBusiness findByEntiteId(Long entiteId);
} 