package com.dhruv.arthrix.repository;

import com.dhruv.arthrix.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {

    Optional<User> findByGoogleId(String googleId);
}
