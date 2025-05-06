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

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @GetMapping
    public List<SousSecteur> getAll() {
        return sousSecteurService.getAllSousSecteurs();
    }

    @GetMapping("/{id}")
    public SousSecteur getById(@PathVariable Long id) {
        return sousSecteurService.getSousSecteurById(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        sousSecteurService.deleteSousSecteur(id);
    }
    @GetMapping("/ping")
    public String ping() {
        return "pong from <service>";
    }

}
	