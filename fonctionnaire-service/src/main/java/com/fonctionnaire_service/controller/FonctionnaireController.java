package com.fonctionnaire_service.controller;

import com.fonctionnaire_service.entity.Fonctionnaire;
import com.fonctionnaire_service.service.FonctionnaireService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fonctionnaires")
public class FonctionnaireController {

    @Autowired
    private FonctionnaireService service;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Fonctionnaire create(@RequestBody Fonctionnaire f) {
        return service.save(f);
    }

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @GetMapping
    public List<Fonctionnaire> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Fonctionnaire getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping("/entite/{entiteId}")
    public List<Fonctionnaire> getByEntite(@PathVariable Long entiteId) {
        return service.getByEntiteId(entiteId);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
    @GetMapping("/ping")
    public String ping() {
        return "pong from <service>";
    }

}
