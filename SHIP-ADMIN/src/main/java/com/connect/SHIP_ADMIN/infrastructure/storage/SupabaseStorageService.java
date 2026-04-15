package com.connect.SHIP_ADMIN.infrastructure.storage;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SupabaseStorageService {

    private final S3Client s3Client;

    @Value("${supabase.s3.bucket-name}")
    private String bucketName;

    @Value("${supabase.s3.endpoint}")
    private String endpoint;

    // Uploads file to Supabase and returns the public access URL
    public String uploadFile(MultipartFile file, String folder) throws IOException {
        String fileName = folder + "/" + UUID.randomUUID() + "_" + file.getOriginalFilename();

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(fileName)
                .contentType(file.getContentType()) // Important for browser preview
                .build();

        s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

        // Construct URL dynamically using endpoint and bucket name
        return String.format("%s/object/public/%s/%s", endpoint, bucketName, fileName);
    }

    // Deletes file from storage using its public URL
    public void deleteFile(String publicUrl) {
        // Extract key by removing the public base path
        String searchPattern = "/public/" + bucketName + "/";
        int index = publicUrl.indexOf(searchPattern);

        if (index != -1) {
            String fileKey = publicUrl.substring(index + searchPattern.length());

            DeleteObjectRequest deleteRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileKey)
                    .build();

            s3Client.deleteObject(deleteRequest);
        }
    }
}