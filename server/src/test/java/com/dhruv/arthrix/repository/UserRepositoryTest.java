package com.dhruv.arthrix.repository;

import com.dhruv.arthrix.entity.User;
import com.dhruv.arthrix.enums.Gender;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.test.context.TestPropertySource;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@TestPropertySource(properties = {
        "spring.datasource.url=jdbc:h2:mem:testdb",
        "spring.jpa.hibernate.ddl-auto=create-drop"
})
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    void saveAndFindById_worksCorrectly() {
        User user = new User();
        user.setGoogleId("test-google-id");
        user.setEmail("repotest@example.com");
        user.setName("Repo Test User");
        user.setGender(Gender.FEMALE);

        User savedUser = userRepository.save(user);

        Optional<User> foundUser = userRepository.findById(savedUser.getId());

        assertTrue(foundUser.isPresent());
        assertEquals("repotest@example.com", foundUser.get().getEmail());
    }

    @Test
    void findById_returnsEmptyForNonExistentUser() {
        Optional<User> foundUser = userRepository.findById(999L);

        assertFalse(foundUser.isPresent());
    }
}