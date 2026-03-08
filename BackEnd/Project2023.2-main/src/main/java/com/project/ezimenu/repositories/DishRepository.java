package com.project.ezimenu.repositories;

import com.project.ezimenu.entities.Dish;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DishRepository extends JpaRepository<Dish, Long> {
    List<Dish> findByStatus(short active);

    Optional<Dish> findByDishIdAndStatus(Long dishId, short active);

    boolean existsByDishNameAndStatus(String dishName, Short dishStatus);
}
