package com.project.ezimenu.repositories;

import com.project.ezimenu.entities.Bill;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BillRepository extends JpaRepository<Bill, Long> {
}
