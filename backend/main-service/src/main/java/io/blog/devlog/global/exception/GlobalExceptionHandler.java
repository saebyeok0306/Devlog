package io.blog.devlog.global.exception;

import io.blog.devlog.global.response.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.io.IOException;

@ControllerAdvice
@RequiredArgsConstructor
public class GlobalExceptionHandler {
    private final ErrorResponse errorResponse;
    @ExceptionHandler(BadRequestException.class)
    public void badRequestExceptionHandler(BadRequestException e, HttpServletRequest request, HttpServletResponse response) throws IOException {
        Integer status = HttpServletResponse.SC_BAD_REQUEST;
        String error = e.getMessage();
        String path = request.getRequestURI();
        errorResponse.setResponse(response, status, error, path);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public void illegalArgumentExceptionHandler(IllegalArgumentException e, HttpServletRequest request, HttpServletResponse response) throws IOException {
        Integer status = HttpServletResponse.SC_BAD_REQUEST;
        String error = e.getMessage();
        String path = request.getRequestURI();
        errorResponse.setResponse(response, status, error, path);
    }

    @ExceptionHandler(NullJwtException.class)
    public void nullJwtExceptionHandler(NullJwtException e, HttpServletRequest request, HttpServletResponse response) throws IOException {
        Integer status = HttpServletResponse.SC_NO_CONTENT;
        String error = e.getMessage();
        String path = request.getRequestURI();
        errorResponse.setResponse(response, status, error, path);
    }

    @ExceptionHandler(NotMatchPasswordException.class)
    public void nullJwtExceptionHandler(NotMatchPasswordException e, HttpServletRequest request, HttpServletResponse response) throws IOException {
        Integer status = HttpServletResponse.SC_BAD_REQUEST;
        String error = e.getMessage();
        String path = request.getRequestURI();
        errorResponse.setResponse(response, status, error, path);
    }
}
