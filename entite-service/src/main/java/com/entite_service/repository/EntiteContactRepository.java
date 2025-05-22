package com.entite_service.repository;

import com.entite_service.entity.EntiteContact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EntiteContactRepository extends JpaRepository<EntiteContact, Long> {
    EntiteContact findByEntiteId(Long entiteId);
} 