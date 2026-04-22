package com.e_learning.backend_core.services;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

@Service
public class PdfService {

    public String extractTextFromPdf(MultipartFile file) throws Exception {
        // Try-with-resources ensures the document closes automatically to prevent memory leaks
        try (InputStream inputStream = file.getInputStream();
             PDDocument document = PDDocument.load(inputStream)) {

            PDFTextStripper pdfStripper = new PDFTextStripper();
            String text = pdfStripper.getText(document);

            // Pro-Tip: LLMs have token limits. If a teacher uploads a 100-page book,
            // the AI might crash. Let's limit the extracted text to roughly the first 15,000 characters.
            if (text.length() > 15000) {
                return text.substring(0, 15000);
            }

            return text;
        }
    }
}