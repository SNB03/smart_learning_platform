package com.e_learning.backend_core.repositories;

import com.e_learning.backend_core.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Spring Data JPA magic: It will automatically write the SQL for this!
    User findByEmail(String email);
    List<User> findByRole(User.Role role);
    Long countByRole(User.Role role);
    //String getStatus();
    Optional<User> findByEmailOrMobileNo(String email, String mobileNo);
    List<User> findByRoleAndClassLevelAndDivision(User.Role role, Integer classLevel, String division);
}