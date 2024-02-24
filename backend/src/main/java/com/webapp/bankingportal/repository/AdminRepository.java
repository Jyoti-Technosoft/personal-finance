package com.webapp.bankingportal.repository;

import com.webapp.bankingportal.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRepository extends JpaRepository<Admin , Long> {
    Admin findByName(String name);
}
