package com.entite_service.repository;

import com.entite_service.entity.EntiteProducts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EntiteProductsRepository extends JpaRepository<EntiteProducts, Long> {
    EntiteProducts findByEntiteId(Long entiteId);
} 