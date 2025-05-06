package com.produit_service.controller;

import com.produit_service.entity.Produit;
import com.produit_service.service.ProduitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/produits")
public class ProduitController {

    @Autowired
    private ProduitService produitService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Produit create(@RequestBody Produit produit) {
        return produitService.saveProduit(produit);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @GetMapping
    public List<Produit> getAll() {
        return produitService.getAllProduits();
    }

    @GetMapping("/{id}")
    public Produit getById(@PathVariable Long id) {
        return produitService.getProduitById(id);
    }

    @GetMapping("/entite/{entiteId}")
    public List<Produit> getByEntite(@PathVariable Long entiteId) {
        return produitService.getProduitsByEntiteId(entiteId);
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        produitService.deleteProduit(id);
    }
    @GetMapping("/ping")
    public String ping() {
        return "pong from <service>";
    }

}
