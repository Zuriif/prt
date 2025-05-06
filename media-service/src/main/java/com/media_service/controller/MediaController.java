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

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/upload")
    public Media upload(@RequestParam("file") MultipartFile file,
                        @RequestParam("entiteId") Long entiteId) throws IOException {
        return mediaService.saveMedia(file, entiteId);
    }

    @GetMapping
    public List<Media> getAll() {
        return mediaService.getAll();
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @GetMapping("/entite/{entiteId}")
    public List<Media> getByEntite(@PathVariable Long entiteId) {
        return mediaService.getByEntiteId(entiteId);
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> download(@PathVariable Long id) throws IOException {
        byte[] data = mediaService.getFile(id);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
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
