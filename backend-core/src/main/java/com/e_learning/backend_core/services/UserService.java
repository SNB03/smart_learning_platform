package com.e_learning.backend_core.services;

import com.e_learning.backend_core.models.User;
import com.e_learning.backend_core.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Fetch all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Save a new user
    public User createUser(User user) {
        // Later, we will add password hashing here before saving!
        return userRepository.save(user);
    }
}