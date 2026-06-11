package com.mishik.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean
    public WebClient overpassWebClient() {

        ExchangeStrategies strategies =
                ExchangeStrategies.builder()
                        .codecs(c ->
                                c.defaultCodecs()
                                        .maxInMemorySize(10 * 1024 * 1024)
                        )
                        .build();

        return WebClient.builder()
                .baseUrl("https://overpass-api.de/api/interpreter")
                .exchangeStrategies(strategies)
                .build();
    }
}
