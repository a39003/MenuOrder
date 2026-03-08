package com.project.ezimenu.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@jakarta.persistence.Table(name = "notifications")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notificationId")
    private long notificationId;
    @Column(name = "notificationTime")
    private LocalDateTime notificationTime;
    @Column(name = "text")
    private String text;
    @ManyToOne
    @JoinColumn(name = "tableId")
    @JsonIgnore
    private Table table;
}

