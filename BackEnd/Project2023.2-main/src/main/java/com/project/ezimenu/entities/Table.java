package com.project.ezimenu.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@jakarta.persistence.Table(name = "tables")
@Data
public class Table {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tableId")
    private long tableId;

    @Column(name = "tableName")
    private String tableName;

    @Column(name = "tableStatus")
    private String tableStatus;

    @Column(name = "startOrderingTime")
    private LocalDateTime startOrderingTime;

    @Column(name = "status")
    private Short status;

    @Column(name = "tableDescription")
    private String tableDescription;

    @Column(name = "tableType")
    private String tableType = "THƯỜNG";

    @Column(name = "floorNumber")
    private Integer floorNumber = 1;

    @Column(name = "capacity")
    private Integer capacity = 4;

    @OneToMany(mappedBy = "table", fetch = FetchType.EAGER)
    @JsonIgnoreProperties("table")
    private List<Order> orders;

    @OneToMany(mappedBy = "table", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @JsonIgnoreProperties("table")
    private List<Notification> notifications;
}
