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
    public Fonctionnaire create(@RequestBody Fonctionnaire fonctionnaire) {
        return service.save(fonctionnaire);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @GetMapping
    public List<Fonctionnaire> getAll() {
        return service.getAll();
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @GetMapping("/{id}")
    public Fonctionnaire getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @GetMapping("/entite/{entiteId}")
    public List<Fonctionnaire> getByEntite(@PathVariable Long entiteId) {
        return service.getByEntiteId(entiteId);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public Fonctionnaire update(@PathVariable Long id, @RequestBody Fonctionnaire fonctionnaire) {
        fonctionnaire.setId(id);
        return service.save(fonctionnaire);
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
