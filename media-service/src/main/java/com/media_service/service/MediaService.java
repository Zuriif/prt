package com.media_service.service;

import com.media_service.entity.Media;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface MediaService {
    Media saveMedia(MultipartFile file, Long entiteId) throws IOException;
    List<Media> getAll();
    List<Media> getByEntiteId(Long entiteId);
    byte[] getFile(Long id) throws IOException;
    void delete(Long id);
    Media getById(Long id);
    Media create(Media media);
    Media update(Media media);
}
