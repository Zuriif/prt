package com.fonctionnaire_service.repository;

import com.fonctionnaire_service.entity.Fonctionnaire;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FonctionnaireRepository extends JpaRepository<Fonctionnaire, Long> {
    List<Fonctionnaire> findByEntiteId(Long entiteId);
}
