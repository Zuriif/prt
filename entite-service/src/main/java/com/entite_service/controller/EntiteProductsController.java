package com.entite_service.controller;

import com.entite_service.entity.EntiteProducts;
import com.entite_service.service.EntiteProductsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/entite-products")
public class EntiteProductsController {

    @Autowired
    private EntiteProductsService entiteProductsService;

    @GetMapping
    public List<EntiteProducts> getAllEntiteProducts() {
        return entiteProductsService.findAll();
    }

    @GetMapping("/{id}")
    public EntiteProducts getEntiteProductsById(@PathVariable Long id) {
        return entiteProductsService.findById(id);
    }

    @GetMapping("/entite/{entiteId}")
    public EntiteProducts getEntiteProductsByEntiteId(@PathVariable Long entiteId) {
        return entiteProductsService.findByEntiteId(entiteId);
    }

    @PostMapping
    public EntiteProducts createEntiteProducts(@RequestBody EntiteProducts entiteProducts) {
        return entiteProductsService.save(entiteProducts);
    }

    @PutMapping("/{id}")
    public EntiteProducts updateEntiteProducts(@PathVariable Long id, @RequestBody EntiteProducts entiteProducts) {
        return entiteProductsService.update(id, entiteProducts);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEntiteProducts(@PathVariable Long id) {
        entiteProductsService.deleteById(id);
        return ResponseEntity.ok().build();
    }
} 