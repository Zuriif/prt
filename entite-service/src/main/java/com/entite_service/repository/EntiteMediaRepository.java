package com.entite_service.repository;

import com.entite_service.entity.EntiteMedia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EntiteMediaRepository extends JpaRepository<EntiteMedia, Long> {
    EntiteMedia findByEntiteId(Long entiteId);
} 