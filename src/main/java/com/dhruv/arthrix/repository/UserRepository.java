package com.dhruv.arthrix.repository;

import com.dhruv.arthrix.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User,Long> {

}
