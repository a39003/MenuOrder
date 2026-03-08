package com.project.ezimenu.repositories;

import com.project.ezimenu.entities.Order;
import com.project.ezimenu.entities.Table;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByTable(Table table);

    Page<Order> findByStatusOrderByOrderTimeDesc(short status, Pageable pageable);

    Optional<Order> findByOrderIdAndStatus(Long orderId, short active);
}
