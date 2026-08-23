package com.project.ezimenu.repositories;

import com.project.ezimenu.entities.Menu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;

import java.util.List;
import java.util.Optional;

public interface MenuRepository extends JpaRepository<Menu, Long> {
    Optional<Menu> findByMenuIdAndStatus(Long menuId, short active);

    @EntityGraph(attributePaths = "dishes")
    List<Menu> findByStatus(short active);

    Optional<Menu> findByMenuTitleAndStatus(String menuTitle, short active);
}
