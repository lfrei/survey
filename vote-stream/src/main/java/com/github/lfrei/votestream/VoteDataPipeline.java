package com.github.lfrei.votestream;

import org.apache.kafka.streams.kstream.KStream;
import org.apache.kafka.streams.kstream.KTable;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.function.Function;

@Configuration
public class VoteDataPipeline {

   @Bean
    public Function<KStream<String, String>, KTable<String, String>> process() {
        return input -> input
                .filter((key, value) -> "55555".equals(key))
                .toTable();
    }
}
