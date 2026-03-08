package com.project.ezimenu.exceptions;

public abstract class BaseException  extends Exception{
    private String message;
    public BaseException(String message)
    {
        super(message);
        this.message = message;
    }
    public abstract int getStatusCode();
    @Override
    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }
}

