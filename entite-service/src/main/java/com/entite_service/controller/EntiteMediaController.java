package com.entite_service.controller;

import com.entite_service.entity.EntiteMedia;
import com.entite_service.service.EntiteMediaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/entite-media")
public class EntiteMediaController {

    @Autowired
    private EntiteMediaService entiteMediaService;

    @GetMapping
    public List<EntiteMedia> getAllEntiteMedia() {
        return entiteMediaService.findAll();
    }

    @GetMapping("/{id}")
    public EntiteMedia getEntiteMediaById(@PathVariable Long id) {
        return entiteMediaService.findById(id);
    }

    @GetMapping("/entite/{entiteId}")
    public EntiteMedia getEntiteMediaByEntiteId(@PathVariable Long entiteId) {
        return entiteMediaService.findByEntiteId(entiteId);
    }

    @PostMapping
    public EntiteMedia createEntiteMedia(@RequestBody EntiteMedia entiteMedia) {
        return entiteMediaService.save(entiteMedia);
    }

    @PutMapping("/{id}")
    public EntiteMedia updateEntiteMedia(@PathVariable Long id, @RequestBody EntiteMedia entiteMedia) {
        return entiteMediaService.update(id, entiteMedia);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEntiteMedia(@PathVariable Long id) {
        entiteMediaService.deleteById(id);
        return ResponseEntity.ok().build();
    }
} 