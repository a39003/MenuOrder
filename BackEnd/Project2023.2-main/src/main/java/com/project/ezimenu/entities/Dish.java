package com.project.ezimenu.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "dishes")
@Data
public class Dish {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "dishId")
    private long dishId;

    @Column(name = "dishName")
    private String dishName;

    @Column(name = "thumbnail")
    private String thumbnail;

    @Column(name = "dishPrice")
    private int dishPrice;

    @Column(name = "dishStatus")
    private Short dishStatus;

    @Column(name = "status")
    private Short status;

    @ManyToOne
    @JoinColumn(name = "menuId")
    @JsonIgnore
    private Menu menu;
}
