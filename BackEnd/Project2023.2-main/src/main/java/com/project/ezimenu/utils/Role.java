package com.project.ezimenu.utils;

public enum Role {
    ADMIN,
    CUSTOMER;
    @Override
    public String toString(){
        return switch (this.ordinal()) {
            case 0 -> "ADMIN";
            case 1 -> "CUSTOMER";
            default -> null;
        };
    }
}
