package com.e_learning.backend_core.controllers;

import com.e_learning.backend_core.models.User;
import com.e_learning.backend_core.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
 // This allows your future React app to talk to this server safely
public class UserController {

    @Autowired
    private UserService userService;

    // Endpoint to get all users
    // Test this by visiting: http://localhost:8080/api/users
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // Endpoint to create a new user
    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        return userService.createUser(user);
    }
}