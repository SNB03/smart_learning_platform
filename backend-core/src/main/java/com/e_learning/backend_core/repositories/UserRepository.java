package com.e_learning.backend_core.repositories;

import com.e_learning.backend_core.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // For Login
    Optional<User> findByEmailOrMobileNo(String email, String mobileNo);

    // For Admin: Get all teachers
    List<User> findByRole(User.Role role);

    // For Teacher: Get students of their specific class and division
    List<User> findByRoleAndClassLevelAndDivision(User.Role role, Integer classLevel, String division);

    // For Analytics: Count by gender within a specific class
    long countByRoleAndClassLevelAndDivisionAndGender(User.Role role, Integer classLevel, String division, String gender);

    long countByRole(User.Role role);

}