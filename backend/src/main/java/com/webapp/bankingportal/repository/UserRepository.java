package com.webapp.bankingportal.repository;

import com.webapp.bankingportal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByAccountAccountNumber(String accountNumber);
}
