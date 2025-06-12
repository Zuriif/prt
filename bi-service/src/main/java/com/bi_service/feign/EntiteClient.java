package com.bi_service.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "entite-service")
public interface EntiteClient {
    
    @GetMapping("/api/entites")
    Object getAllEntites(@RequestHeader("Authorization") String token);
    
    @GetMapping("/api/entites")
    Object getEntiteStatistics(@RequestHeader("Authorization") String token);
}
