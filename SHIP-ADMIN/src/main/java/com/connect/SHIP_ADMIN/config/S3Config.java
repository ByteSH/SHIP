package com.connect.SHIP_ADMIN.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.http.apache.ApacheHttpClient;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;

import java.net.URI;

@Configuration
public class S3Config {

    @Value("${supabase.s3.endpoint}")
    private String endpoint;

    @Value("${supabase.s3.access-key}")
    private String accessKey;

    @Value("${supabase.s3.secret-key}")
    private String secretKey;

    @Value("${supabase.s3.region}")
    private String region;

    @Bean
    public S3Client s3Client() {
        return S3Client.builder()
                .endpointOverride(URI.create(endpoint)) // Ensure this is https://PROJECT_ID.supabase.co/storage/v1/s3
                .region(Region.of(region)) // ap-south-1
                .serviceConfiguration(S3Configuration.builder()
                        .pathStyleAccessEnabled(true) // Bahut zaroori hai 404 fix karne ke liye
                        .build())
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(accessKey, secretKey)))
                .build();
    }
}