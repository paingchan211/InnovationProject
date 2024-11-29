import React, { useState, useMemo, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import validator from "validator";
import zxcvbn from "zxcvbn";
import styles from "../styles/Login.module.css"; // Import scoped CSS module

// Security Utilities Class
class SecurityUtilities {
  static sanitizeInput(input, maxLength = 255) {
    if (!input) return "";
    return input
      .toString()
      .replace(/[<>&"'/\\]/g, "")
      .trim()
      .substring(0, maxLength);
  }

  static validateEmail(email) {
    return validator.isEmail(email) && email.length <= 100;
  }

  static validatePassword(password) {
    const minLength = 8;
    const maxLength = 64;
    const strengthResult = zxcvbn(password);

    return (
      password.length >= minLength &&
      password.length <= maxLength &&
      strengthResult.score >= 1
    );
  }
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const inputValidation = useMemo(() => {
    const sanitizedEmail = SecurityUtilities.sanitizeInput(email);
    const sanitizedPassword = SecurityUtilities.sanitizeInput(password);

    const isEmailValid = SecurityUtilities.validateEmail(sanitizedEmail);
    const isPasswordValid =
      SecurityUtilities.validatePassword(sanitizedPassword);

    console.log("Input Validation:", {
      email: {
        original: email,
        sanitized: sanitizedEmail,
        isValid: isEmailValid,
      },
      password: {
        original: password.length ? "**********" : "",
        isValid: isPasswordValid,
      },
      overallValidation: isEmailValid && isPasswordValid,
    });

    return {
      sanitizedEmail,
      sanitizedPassword,
      isValid: isEmailValid && isPasswordValid,
    };
  }, [email, password]);

  const handleLogin = useCallback(
    async (e) => {
      e.preventDefault();

      if (isLoading) return;

      const { sanitizedEmail, sanitizedPassword, isValid } = inputValidation;

      if (!isValid) {
        setError("Invalid email or password format");
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const response = await axios.post(
          "http://localhost:5002/api/auth/login",
          { email: sanitizedEmail, password: sanitizedPassword },
          { headers: { "Content-Type": "application/json" }, timeout: 10000 }
        );

        if (response.data.token) {
          const decodedToken = JSON.parse(
            atob(response.data.token.split(".")[1])
          );
          localStorage.setItem("token", response.data.token);
          navigate(decodedToken.role === "admin" ? "/admin" : "/user");
        } else {
          throw new Error("No authentication token");
        }
      } catch (error) {
        let errorMessage = "Login failed. Please try again.";
        if (error.response) {
          errorMessage =
            error.response.status === 401
              ? "Invalid credentials"
              : "Service unavailable. Please try again later.";
        } else if (error.request) {
          errorMessage =
            "No response from server. Check your network connection.";
        }
        setError(errorMessage);
        console.error("Login error:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [inputValidation, isLoading, navigate]
  );

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h2>Login</h2>
        <form className={styles.loginForm} onSubmit={handleLogin}>
          <input
            className={styles.inputField}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="off"
            autoCapitalize="none"
            disabled={isLoading}
          />
          <input
            className={styles.inputField}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="off"
            disabled={isLoading}
          />
          {error && <p className={styles.error}>{error}</p>}
          <button
            className={styles.submitButton}
            type="submit"
            disabled={!inputValidation.isValid || isLoading}
          >
            {isLoading ? "Logging In..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
