package com.entite_service.service.impl;

import com.entite_service.dto.EntiteFullDTO;
import com.entite_service.entity.*;
import com.entite_service.repository.*;
import com.entite_service.service.EntiteService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class EntiteServiceImpl implements EntiteService {

    private final EntiteRepository entiteRepository;
    private final EntiteBusinessRepository entiteBusinessRepository;
    private final EntiteContactRepository entiteContactRepository;
    private final EntiteProductsRepository entiteProductsRepository;
    private final EntiteMediaRepository entiteMediaRepository;
    private final EntiteLocationRepository entiteLocationRepository;
    private final EntiteAdditionalRepository entiteAdditionalRepository;
    private final ModelMapper mapper;

    @Override
    public EntiteFullDTO save(EntiteFullDTO dto) {
        Entite entite = mapper.map(dto, Entite.class);
        entite = entiteRepository.save(entite);

        if (hasRealData(dto.getEntiteBusiness())) {
            EntiteBusiness business = mapper.map(dto.getEntiteBusiness(), EntiteBusiness.class);
            business.setEntite(entite);
            entiteBusinessRepository.save(business);
            entite.setEntiteBusiness(business);
        }

        if (hasRealData(dto.getEntiteContact())) {
            EntiteContact contact = mapper.map(dto.getEntiteContact(), EntiteContact.class);
            contact.setEntite(entite);
            entiteContactRepository.save(contact);
            entite.setEntiteContact(contact);
        }

        if (hasRealData(dto.getEntiteProducts())) {
            EntiteProducts products = mapper.map(dto.getEntiteProducts(), EntiteProducts.class);
            products.setEntite(entite);
            entiteProductsRepository.save(products);
            entite.setEntiteProducts(products);
        }

        if (hasRealData(dto.getEntiteMedia())) {
            EntiteMedia media = mapper.map(dto.getEntiteMedia(), EntiteMedia.class);
            media.setEntite(entite);
            entiteMediaRepository.save(media);
            entite.setEntiteMedia(media);
        }

        if (hasRealData(dto.getEntiteLocation())) {
            EntiteLocation location = mapper.map(dto.getEntiteLocation(), EntiteLocation.class);
            location.setEntite(entite);
            entiteLocationRepository.save(location);
            entite.setEntiteLocation(location);
        }

        if (hasRealData(dto.getEntiteAdditional())) {
            EntiteAdditional additional = mapper.map(dto.getEntiteAdditional(), EntiteAdditional.class);
            additional.setEntite(entite);
            entiteAdditionalRepository.save(additional);
            entite.setEntiteAdditional(additional);
        }

        return mapper.map(entite, EntiteFullDTO.class);
    }

    @Override
    public EntiteFullDTO update(Long id, EntiteFullDTO dto) {
        Entite existing = entiteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Entite not found"));
        mapper.map(dto, existing);
        entiteRepository.save(existing);

        if (hasRealData(dto.getEntiteBusiness())) {
            EntiteBusiness business = mapper.map(dto.getEntiteBusiness(), EntiteBusiness.class);
            business.setEntite(existing);
            entiteBusinessRepository.save(business);
            existing.setEntiteBusiness(business);
        }

        if (hasRealData(dto.getEntiteContact())) {
            EntiteContact contact = mapper.map(dto.getEntiteContact(), EntiteContact.class);
            contact.setEntite(existing);
            entiteContactRepository.save(contact);
            existing.setEntiteContact(contact);
        }

        if (hasRealData(dto.getEntiteProducts())) {
            EntiteProducts products = mapper.map(dto.getEntiteProducts(), EntiteProducts.class);
            products.setEntite(existing);
            entiteProductsRepository.save(products);
            existing.setEntiteProducts(products);
        }

        if (hasRealData(dto.getEntiteMedia())) {
            EntiteMedia media = mapper.map(dto.getEntiteMedia(), EntiteMedia.class);
            media.setEntite(existing);
            entiteMediaRepository.save(media);
            existing.setEntiteMedia(media);
        }

        if (hasRealData(dto.getEntiteLocation())) {
            EntiteLocation location = mapper.map(dto.getEntiteLocation(), EntiteLocation.class);
            location.setEntite(existing);
            entiteLocationRepository.save(location);
            existing.setEntiteLocation(location);
        }

        if (hasRealData(dto.getEntiteAdditional())) {
            EntiteAdditional additional = mapper.map(dto.getEntiteAdditional(), EntiteAdditional.class);
            additional.setEntite(existing);
            entiteAdditionalRepository.save(additional);
            existing.setEntiteAdditional(additional);
        }

        return mapper.map(existing, EntiteFullDTO.class);
    }

    @Override
    public void deleteById(Long id) {
        entiteRepository.deleteById(id);
    }

    @Override
    public List<EntiteFullDTO> findAll() {
        return entiteRepository.findAll().stream()
                .map(entite -> mapper.map(entite, EntiteFullDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public EntiteFullDTO findById(Long id) {
        Entite entite = entiteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Entite not found"));
        return mapper.map(entite, EntiteFullDTO.class);
    }

    private boolean hasRealData(Object obj) {
        if (obj == null) return false;
        return Arrays.stream(obj.getClass().getDeclaredFields())
                .filter(field -> !field.getName().equals("id"))
                .anyMatch(field -> {
                    field.setAccessible(true);
                    try {
                        Object value = field.get(obj);
                        if (value == null) return false;
                        if (value instanceof String str) {
                            return !str.trim().isEmpty();
                        }
                        return true;
                    } catch (IllegalAccessException e) {
                        return false;
                    }
                });
    }
}
