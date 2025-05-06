package com.entite_service.controller;

import com.entite_service.entity.Entite;
import com.entite_service.service.EntiteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/entites")
public class EntiteController {

    @Autowired
    private EntiteService entiteService;
    
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Entite createEntite(@RequestBody Entite entite) {
        return entiteService.saveEntite(entite);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @GetMapping
    public List<Entite> getAll() {
        return entiteService.getAllEntites();
    }

    @GetMapping("/{id}")
    public Entite getById(@PathVariable Long id) {
        return entiteService.getEntiteById(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        entiteService.deleteEntite(id);
    }
    
    @GetMapping("/ping")
    public String ping() {
        return "pong from <service>";
    }

}
