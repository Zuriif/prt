package com.media_service.service.impl;

import com.media_service.entity.Media;
import com.media_service.repository.MediaRepository;
import com.media_service.service.MediaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@Service
public class MediaServiceImpl implements MediaService {

    private static final String UPLOAD_DIR = "uploads";

    @Autowired
    private MediaRepository mediaRepository;

    @Override
    public Media saveMedia(MultipartFile file, Long entiteId) throws IOException {
        Files.createDirectories(Paths.get(UPLOAD_DIR));
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(UPLOAD_DIR, fileName);
        Files.write(filePath, file.getBytes());

        Media media = Media.builder()
                .nomFichier(file.getOriginalFilename())
                .cheminFichier(filePath.toString())
                .type(file.getContentType())
                .entiteId(entiteId)
                .build();

        return mediaRepository.save(media);
    }

    @Override
    public List<Media> getAll() {
        return mediaRepository.findAll();
    }

    @Override
    public List<Media> getByEntiteId(Long entiteId) {
        return mediaRepository.findByEntiteId(entiteId);
    }

    @Override
    public byte[] getFile(Long id) throws IOException {
        Media media = mediaRepository.findById(id).orElseThrow();
        return Files.readAllBytes(Paths.get(media.getCheminFichier()));
    }

    @Override
    public void delete(Long id) {
        mediaRepository.deleteById(id);
    }

    @Override
    public Media getById(Long id) {
        return mediaRepository.findById(id).orElse(null);
    }

    @Override
    public Media create(Media media) {
        return mediaRepository.save(media);
    }

    @Override
    public Media update(Media media) {
        return mediaRepository.save(media);
    }
}
