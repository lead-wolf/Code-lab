package com.codelab.exception;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@Getter
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Lỗi không xác định"),
    UNAUTHENTICATED(1010, "Unauthenticated"),
    USER_NOT_EXISTED(1011, "User không tồn tại"),
    USER_EXISTED(1012, "User đã tồn tại"),
    USER_NOT_ACTIVE(1013, "Tài khoản chưa được kích hoạt \n Vui lòng liên hệ Quản trị viên"),
    PASSWORD_NOT_MATH(1014, "Mật khẩu không chính xác"),
    TOKEN_NOT_VALID(1015, "Token không hợp lệ"),
    NOT_EXISTED(1016, "EXISTED"),
    TITLE_NOT_BLANK(1017, "Title cannot be blank"),
    LEVEL_NOT_BLANK(1018, "Level cannot be blank"),
    INVALID_KEY(1001, "Uncategorized error"),
    ;

    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

    int code;
    String message;
}
