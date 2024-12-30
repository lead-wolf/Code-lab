package com.codelab.respository;

import com.codelab.entity.Level;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LevelRopository extends JpaRepository<Level, Long> {
    Optional<Level> findByName(String name);
}
