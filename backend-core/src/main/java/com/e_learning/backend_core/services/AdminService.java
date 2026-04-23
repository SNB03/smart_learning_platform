package com.e_learning.backend_core.services;

import com.e_learning.backend_core.models.User;
import com.e_learning.backend_core.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    public List<Map<String, Object>> generateStudentDemographics() {
        // 1. Fetch all active students from the database
        List<User> allStudents = userRepository.findByRole(User.Role.STUDENT);

        // 2. Group students by Class Level (e.g., 5, 6, 7)
        Map<Integer, List<User>> studentsByClass = allStudents.stream()
                .filter(s -> s.getClassLevel() != null)
                .collect(Collectors.groupingBy(User::getClassLevel));

        List<Map<String, Object>> result = new ArrayList<>();

        // 3. Iterate through each Class Level
        for (Map.Entry<Integer, List<User>> classEntry : studentsByClass.entrySet()) {
            Integer classLevel = classEntry.getKey();
            List<User> classStudents = classEntry.getValue();

            // 4. Group students in this class by Division (e.g., "A", "B")
            Map<String, List<User>> studentsByDivision = classStudents.stream()
                    .filter(s -> s.getDivision() != null)
                    .collect(Collectors.groupingBy(User::getDivision));

            List<Map<String, Object>> divisionsList = new ArrayList<>();

            // 5. Calculate Boys/Girls for each Division
            for (Map.Entry<String, List<User>> divEntry : studentsByDivision.entrySet()) {
                String divisionName = divEntry.getKey();
                List<User> divStudents = divEntry.getValue();

                long boysCount = divStudents.stream()
                        .filter(s -> "Boy".equalsIgnoreCase(s.getGender()) || "Male".equalsIgnoreCase(s.getGender()))
                        .count();

                long girlsCount = divStudents.stream()
                        .filter(s -> "Girl".equalsIgnoreCase(s.getGender()) || "Female".equalsIgnoreCase(s.getGender()))
                        .count();

                List<User> teachers = userRepository.findByRoleAndClassLevelAndDivision(
                        User.Role.TEACHER, classLevel, divisionName
                );

                User classTeacher = teachers.isEmpty() ? null : teachers.get(0);
                Map<String, Object> teacherMap = new HashMap<>();
                if (classTeacher != null) {
                    teacherMap.put("id", classTeacher.getId());
                    teacherMap.put("name", classTeacher.getFullName());
                } else {
                    teacherMap.put("id", null);
                    teacherMap.put("name", "Unassigned");
                }

                // 7. Build the Division Map
                Map<String, Object> divisionMap = new HashMap<>();
                divisionMap.put("name", divisionName);
                divisionMap.put("classTeacher", teacherMap);
                divisionMap.put("boys", boysCount);
                divisionMap.put("girls", girlsCount);

                divisionsList.add(divisionMap);
            }

            // Sort divisions alphabetically (A, B, C...)
            divisionsList.sort((d1, d2) -> ((String) d1.get("name")).compareTo((String) d2.get("name")));

            // 8. Build the Class Level Map
            Map<String, Object> classLevelMap = new HashMap<>();
            classLevelMap.put("classLevel", String.valueOf(classLevel));
            classLevelMap.put("divisions", divisionsList);

            result.add(classLevelMap);
        }

        // Sort class levels numerically (5, 6, 7...)
        result.sort((c1, c2) -> Integer.compare(
                Integer.parseInt((String) c1.get("classLevel")),
                Integer.parseInt((String) c2.get("classLevel"))
        ));

        return result;
    }
}