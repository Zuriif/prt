package com.parametrage_service.controller;

import com.parametrage_service.entity.TypeEntreprise;
import com.parametrage_service.service.TypeEntrepriseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/type-entreprises")
public class TypeEntrepriseController {

    @Autowired
    private TypeEntrepriseService typeEntrepriseService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public TypeEntreprise create(@RequestBody TypeEntreprise typeEntreprise) {
        return typeEntrepriseService.saveTypeEntreprise(typeEntreprise);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @GetMapping
    public List<TypeEntreprise> getAll() {
        return typeEntrepriseService.getAllTypeEntreprises();
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @GetMapping("/{id}")
    public TypeEntreprise getById(@PathVariable Long id) {
        return typeEntrepriseService.getTypeEntrepriseById(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public TypeEntreprise update(@PathVariable Long id, @RequestBody TypeEntreprise typeEntreprise) {
        typeEntreprise.setId(id);
        return typeEntrepriseService.saveTypeEntreprise(typeEntreprise);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        typeEntrepriseService.deleteTypeEntreprise(id);
    }

    @GetMapping("/ping")
    public String ping() {
        return "pong from <service>";
    }
}
