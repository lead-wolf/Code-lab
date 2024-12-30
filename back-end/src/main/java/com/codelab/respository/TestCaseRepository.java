package com.codelab.respository;

import com.codelab.entity.TestCase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TestCaseRepository extends JpaRepository<TestCase, Integer> {
    @Query("SELECT e FROM TestCase e WHERE e.assignment.id = :id")
    Optional<List<TestCase>> findByAssignment(Integer id);
}
