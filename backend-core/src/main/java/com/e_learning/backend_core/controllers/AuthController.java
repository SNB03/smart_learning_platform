package com.e_learning.backend_core.controllers;

import com.e_learning.backend_core.models.User;
import com.e_learning.backend_core.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")

public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody Map<String, String> credentials) {
        String identifier = credentials.get("identifier"); // This holds either Email OR Mobile
        String password = credentials.get("password");

        // Search the database for a matching email OR mobile number
        Optional<User> userOpt = userRepository.findByEmailOrMobileNo(identifier, identifier);

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            // Check if account was deactivated by Admin
            if ("inactive".equals(user.getStatus())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Your account is inactive. Please contact the Administrator.");
            }

            // Verify Password (Note: In production, use BCryptPasswordEncoder here!)
            if (user.getPasswordHash().equals(password)) {

                // For security, never send the password back to the React frontend
                user.setPasswordHash(null);

                return ResponseEntity.ok(user); // Send the user details to React
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email/mobile or password.");
    }
}