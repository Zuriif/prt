package com.produit_service.service;

import com.produit_service.entity.Produit;
import java.util.List;

public interface ProduitService {
    Produit saveProduit(Produit produit);
    List<Produit> getAllProduits();
    Produit getProduitById(Long id);
    List<Produit> getProduitsByEntiteId(Long entiteId);
    void deleteProduit(Long id);
}
