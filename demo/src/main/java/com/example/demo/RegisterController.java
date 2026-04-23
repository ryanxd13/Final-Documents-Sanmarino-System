package com.example.demo;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.sql.*;

@RestController
public class RegisterController {

    @PostMapping("/register")
    public String register(@RequestBody User user) {
        try {
            Class.forName("net.ucanaccess.jdbc.UcanaccessDriver");
            String dbURL = "jdbc:ucanaccess://C://Users//ryanh//Downloads//demo//demo//SanMarinoDB.accdb";
            Connection conn = DriverManager.getConnection(dbURL);

            PreparedStatement ps = conn.prepareStatement(
                "INSERT INTO User (Name, Email) VALUES (?, ?)"
            );
            ps.setString(1, user.getFirstName() + " " +
                            (user.getMiddleName() != null ? user.getMiddleName() + " " : "") +
                            user.getLastName());
            ps.setString(2, user.getEmail());
            ps.executeUpdate();

            conn.close();
            return "Registration successful!";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
    }
}