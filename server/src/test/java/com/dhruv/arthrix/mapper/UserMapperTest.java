package com.dhruv.arthrix.mapper;

import com.dhruv.arthrix.dto.response.UserProfileDTO;
import com.dhruv.arthrix.entity.User;
import com.dhruv.arthrix.enums.DietPreference;
import com.dhruv.arthrix.enums.FitnessGoal;
import com.dhruv.arthrix.enums.Gender;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class UserMapperTest {

    @Test
    void toDTO_mapsAllFieldsCorrectly() {
        User user = new User();
        user.setId(1L);
        user.setGoogleId("google-secret-id-123");
        user.setEmail("test@example.com");
        user.setName("Test User");
        user.setAge(25);
        user.setGender(Gender.MALE);
        user.setHeight(175.0);
        user.setWeight(70.0);
        user.setDietPreference(DietPreference.VEG);
        user.setFitnessGoal(FitnessGoal.GAIN_MUSCLE);

        UserProfileDTO dto = UserMapper.toDTO(user);

        assertEquals(user.getId(), dto.getId());
        assertEquals(user.getEmail(), dto.getEmail());
        assertEquals(user.getName(), dto.getName());
        assertEquals(user.getAge(), dto.getAge());
        assertEquals(user.getGender(), dto.getGender());
        assertEquals(user.getHeight(), dto.getHeight());
        assertEquals(user.getWeight(), dto.getWeight());
        assertEquals(user.getDietPreference(), dto.getDietPreference());
        assertEquals(user.getFitnessGoal(), dto.getFitnessGoal());
    }

    @Test
    void toDTO_neverExposesGoogleId() {
        User user = new User();
        user.setGoogleId("google-secret-id-123");

        UserProfileDTO dto = UserMapper.toDTO(user);

        assertFalse(hasGetGoogleIdMethod(dto));
    }

    private boolean hasGetGoogleIdMethod(UserProfileDTO dto) {
        try {
            dto.getClass().getMethod("getGoogleId");
            return true;
        } catch (NoSuchMethodException e) {
            return false;
        }
    }
}