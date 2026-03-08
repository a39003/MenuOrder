package com.project.ezimenu.exceptions;

public class ErrorMessage {
    private String message;
    private int statusCode;

    public ErrorMessage(String message, int statusCode){
        this.message = message;
        this.statusCode = statusCode;
    }
    public int getStatusCode() {
        return statusCode;
    }

    public String getMessage() {
        return message;
    }
}
