package com.project.ezimenu.services.interfaces;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.concurrent.ExecutionException;

public interface IUploadService {
    String upload(byte[] bytes, String fileName, String folderName) throws IOException;
    String[] uploadImages(MultipartFile[] images) throws IOException, ExecutionException, InterruptedException;
    void deleteImage(String publicId) throws IOException;
}
