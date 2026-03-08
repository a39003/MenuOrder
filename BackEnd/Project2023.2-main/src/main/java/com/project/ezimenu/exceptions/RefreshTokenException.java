package com.project.ezimenu.exceptions;

public class RefreshTokenException extends BaseException{
    public RefreshTokenException(String message){
        super(message);
        this.message = message;
    }
    private int StatusCode = 403;
    private String message;
    @Override
    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }
    @Override
    public int getStatusCode() {
        return StatusCode;
    }
}
