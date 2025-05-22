package com.entite_service.controller;

import com.entite_service.entity.Entite;
import com.entite_service.service.EntiteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/entites")
public class EntiteController {

    @Autowired
    private EntiteService entiteService;

    @GetMapping
    public List<Entite> getAllEntites() {
        return entiteService.findAll();
    }

    @GetMapping("/{id}")
    public Entite getEntiteById(@PathVariable Long id) {
        return entiteService.findById(id);
    }

    @PostMapping
    public Entite createEntite(@RequestBody Entite entite) {
        return entiteService.save(entite);
    }

    @PutMapping("/{id}")
    public Entite updateEntite(@PathVariable Long id, @RequestBody Entite entite) {
        return entiteService.update(id, entite);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEntite(@PathVariable Long id) {
        entiteService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
