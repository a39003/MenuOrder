package com.project.ezimenu.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "menus")
@Data
public class Menu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "menuId")
    private long menuId;

    @Column(name = "menuTitle")
    private String menuTitle;

    @Column(name = "status")
    private Short status;

    @Column(name = "menuDescription")
    private String menuDescription;

    @OneToMany(mappedBy = "menu", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("menu")
    private List<Dish> dishes;
}
