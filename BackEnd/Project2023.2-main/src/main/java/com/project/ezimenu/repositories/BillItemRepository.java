package com.project.ezimenu.repositories;

import com.project.ezimenu.entities.BillItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BillItemRepository extends JpaRepository<BillItem, Long> {
}
