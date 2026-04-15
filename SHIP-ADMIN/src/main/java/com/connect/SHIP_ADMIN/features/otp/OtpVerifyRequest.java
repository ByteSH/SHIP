package com.connect.SHIP_ADMIN.features.otp;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OtpVerifyRequest {
    private String username;
    private String password;
    private String otp;
}