package com.parametrage_service.controller;

import com.parametrage_service.entity.Secteur;
import com.parametrage_service.service.SecteurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/secteurs")
public class SecteurController {

    @Autowired
    private SecteurService secteurService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Secteur create(@RequestBody Secteur secteur) {
        return secteurService.saveSecteur(secteur);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @GetMapping
    public List<Secteur> getAll() {
        return secteurService.getAllSecteurs();
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @GetMapping("/{id}")
    public Secteur getById(@PathVariable Long id) {
        return secteurService.getSecteurById(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public Secteur update(@PathVariable Long id, @RequestBody Secteur secteur) {
        secteur.setId(id);
        return secteurService.saveSecteur(secteur);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        secteurService.deleteSecteur(id);
    }

    @GetMapping("/ping")
    public String ping() {
        return "pong from <service>";
    }
}
