package com.entite_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class EntiteServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(EntiteServiceApplication.class, args);
	}

}
