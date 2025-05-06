package com.gateway_service.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

@Configuration
public class CorsGlobalFilter implements WebFilter {

    @Override
    public Mono<Void> filter(ServerWebExchange ctx, WebFilterChain chain) {
        var request  = ctx.getRequest();
        var response = ctx.getResponse();
        HttpHeaders headers = response.getHeaders();

        // 1) Ajout toujours des en-têtes CORS
        headers.add("Access-Control-Allow-Origin", "http://localhost:5173");
        headers.add("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
        headers.add("Access-Control-Allow-Headers", "Authorization,Content-Type");
        headers.add("Access-Control-Allow-Credentials", "true");

        // 2) Si c'est une preflight OPTIONS, on répond tout de suite 200
        if (request.getMethod() == HttpMethod.OPTIONS) {
            response.setStatusCode(HttpStatus.OK);
            return Mono.empty();
        }

        // 3) Sinon, on continue la chaîne
        return chain.filter(ctx);
    }
}
