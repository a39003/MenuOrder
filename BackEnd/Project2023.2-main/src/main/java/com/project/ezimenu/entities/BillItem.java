package com.project.ezimenu.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "billItems")
@Data
public class BillItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "billItemId")
    private long billItemId;

    @Column(name = "billItemName")
    private String billItemName;

    @Column(name = "billItemPrice")
    private int billItemPrice;

    @Column(name = "billItemQuantity")
    private int billItemQuantity;

    @ManyToOne
    @JoinColumn(name = "billId")
    @JsonIgnoreProperties("billItems")
    private Bill bill;
}
