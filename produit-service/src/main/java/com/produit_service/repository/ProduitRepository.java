package com.produit_service.repository;

import com.produit_service.entity.Produit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProduitRepository extends JpaRepository<Produit, Long> {
    List<Produit> findByEntiteId(Long entiteId);
}
