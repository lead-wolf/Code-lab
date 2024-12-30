package com.codelab.respository;

import com.codelab.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    @Query("SELECT e FROM User e where e.email =?1 ")
    Optional<User> findByEmail(String email);

}
