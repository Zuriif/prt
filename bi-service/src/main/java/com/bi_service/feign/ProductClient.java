package com.bi_service.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "produit-service")
public interface ProductClient {
    @GetMapping("/api/produits")
    Object getAllProduits(@RequestHeader("Authorization") String token);
} 