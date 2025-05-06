package com.produit_service.service.impl;

import com.produit_service.entity.Produit;
import com.produit_service.repository.ProduitRepository;
import com.produit_service.service.ProduitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProduitServiceImpl implements ProduitService {

    @Autowired
    private ProduitRepository repository;

    @Override
    public Produit saveProduit(Produit produit) {
        return repository.save(produit);
    }

    @Override
    public List<Produit> getAllProduits() {
        return repository.findAll();
    }

    @Override
    public Produit getProduitById(Long id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public List<Produit> getProduitsByEntiteId(Long entiteId) {
        return repository.findByEntiteId(entiteId);
    }

    @Override
    public void deleteProduit(Long id) {
        repository.deleteById(id);
    }
}
