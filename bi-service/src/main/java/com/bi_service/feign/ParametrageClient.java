package com.bi_service.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import feign.Logger;

@FeignClient(name = "parametrage-service", url = "${parametrage.service.url}", configuration = ParametrageClient.Configuration.class)
public interface ParametrageClient {
    
    @GetMapping("/api/secteurs")
    Object getAllSecteurs(@RequestHeader("Authorization") String token);
    
    @GetMapping("/api/sous-secteurs")
    Object getAllSousSecteurs(@RequestHeader("Authorization") String token);

    @GetMapping("/api/type-entreprises")
    Object getAllTypeEntreprises(@RequestHeader("Authorization") String token);

    class Configuration {
        public Logger.Level feignLoggerLevel() {
            return Logger.Level.FULL;
        }
    }
} 