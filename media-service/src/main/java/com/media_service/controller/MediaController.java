package com.media_service.controller;

import com.media_service.entity.Media;
import com.media_service.service.MediaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/media")
public class MediaController {

    @Autowired
    private MediaService mediaService;

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @PostMapping("/upload")
    public Media upload(@RequestParam("file") MultipartFile file,
                       @RequestParam(value = "entiteId", required = false) Long entiteId,
                       @RequestParam(value = "description", required = false) String description) throws IOException {
        Media media = mediaService.saveMedia(file, entiteId);
        if (description != null && !description.isEmpty()) {
            media.setDescription(description);
            mediaService.update(media);
        }
        return media;
    }

    @GetMapping
    public List<Media> getAll() {
        return mediaService.getAll();
    }

    @GetMapping("/{id}")
    public Media getById(@PathVariable Long id) {
        return mediaService.getById(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Media create(@RequestBody Media media) {
        return mediaService.create(media);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public Media update(@PathVariable Long id, @RequestBody Media media) {
        media.setId(id);
        return mediaService.update(media);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @GetMapping("/entite/{entiteId}")
    public List<Media> getByEntite(@PathVariable Long entiteId) {
        return mediaService.getByEntiteId(entiteId);
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> download(@PathVariable Long id) throws IOException {
        Media media = mediaService.getById(id);
        if (media == null) {
            return ResponseEntity.notFound().build();
        }
        
        byte[] data = mediaService.getFile(id);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(media.getType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + media.getNomFichier() + "\"")
                .body(data);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        mediaService.delete(id);
    }

    @GetMapping("/ping")
    public String ping() {
        return "pong from <service>";
    }
}
