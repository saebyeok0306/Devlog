package io.blog.devlog.global.exception;

public class NullJwtException extends RuntimeException {
    public NullJwtException() {
        super();
    }

    public NullJwtException(String message) {
        super(message);
    }

    public NullJwtException(String message, Throwable cause) {
        super(message, cause);
    }

    public NullJwtException(Throwable cause) {
        super(cause);
    }
}
