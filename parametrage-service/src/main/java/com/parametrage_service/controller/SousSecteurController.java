package com.parametrage_service.controller;

import com.parametrage_service.entity.SousSecteur;
import com.parametrage_service.service.SousSecteurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sous-secteurs")
public class SousSecteurController {

    @Autowired
    private SousSecteurService sousSecteurService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public SousSecteur create(@RequestBody SousSecteur sousSecteur) {
        return sousSecteurService.saveSousSecteur(sousSecteur);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @GetMapping
    public List<SousSecteur> getAll() {
        return sousSecteurService.getAllSousSecteurs();
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @GetMapping("/{id}")
    public SousSecteur getById(@PathVariable Long id) {
        return sousSecteurService.getSousSecteurById(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public SousSecteur update(@PathVariable Long id, @RequestBody SousSecteur sousSecteur) {
        sousSecteur.setId(id);
        return sousSecteurService.saveSousSecteur(sousSecteur);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        sousSecteurService.deleteSousSecteur(id);
    }

    @GetMapping("/ping")
    public String ping() {
        return "pong from <service>";
    }
}
	