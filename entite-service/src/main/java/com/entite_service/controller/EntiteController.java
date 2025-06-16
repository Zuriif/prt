package com.entite_service.controller;

import com.entite_service.dto.EntiteFullDTO;
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
    public List<EntiteFullDTO> getAllEntites() {
        return entiteService.findAll();
    }

    @GetMapping("/{id}")
    public EntiteFullDTO getEntiteById(@PathVariable Long id) {
        return entiteService.findById(id);
    }

    @PostMapping
    public EntiteFullDTO createEntite(@RequestBody EntiteFullDTO entiteDTO) {
        return entiteService.save(entiteDTO);
    }

    @PutMapping("/{id}")
    public EntiteFullDTO updateEntite(@PathVariable Long id, @RequestBody EntiteFullDTO entiteDTO) {
        return entiteService.update(id, entiteDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEntite(@PathVariable Long id) {
        entiteService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
