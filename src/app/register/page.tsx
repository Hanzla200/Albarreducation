/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState } from "react";
import InputField from "../../components/forms/inputfield";
import PasswordField from "../../components/forms/passwordfield";
import SubmitButton from "../../components/forms/submitbutton";
import { registerUser } from "../../services/authservic";
import { validateEmail } from "../../utils/validation";

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    // Clear error while typing
    if (error) {
      setError("");
    }
  };

  // ==========================================
  // PASSWORD CHECKS
  // ==========================================

  const password = form.password;

  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),

    // Any character other than A-Z, a-z and 0-9
    // is considered a special character.
    special: /[^A-Za-z0-9]/.test(password),
  };

  const passedChecks = Object.values(passwordChecks).filter(
    Boolean
  ).length;

  // ==========================================
  // PASSWORD STRENGTH
  // ==========================================

  let passwordStrength = "Very Weak";
  let strengthWidth = "w-0";
  let strengthColor = "bg-red-500";
  let strengthText = "text-red-400";

  if (passedChecks === 1) {
    passwordStrength = "Very Weak";
    strengthWidth = "w-1/5";
    strengthColor = "bg-red-500";
    strengthText = "text-red-400";
  } else if (passedChecks === 2) {
    passwordStrength = "Weak";
    strengthWidth = "w-2/5";
    strengthColor = "bg-orange-500";
    strengthText = "text-orange-400";
  } else if (passedChecks === 3) {
    passwordStrength = "Medium";
    strengthWidth = "w-3/5";
    strengthColor = "bg-yellow-500";
    strengthText = "text-yellow-400";
  } else if (passedChecks === 4) {
    passwordStrength = "Strong";
    strengthWidth = "w-4/5";
    strengthColor = "bg-green-400";
    strengthText = "text-green-400";
  } else if (passedChecks === 5) {
    if (password.length >= 12) {
      passwordStrength = "Very Strong";
    } else {
      passwordStrength = "Strong";
    }

    strengthWidth = "w-full";
    strengthColor = "bg-green-500";
    strengthText = "text-green-400";
  }

  const isPasswordStrong = passedChecks === 5;

  // ==========================================
  // HANDLE REGISTER
  // ==========================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    // ------------------------------------------
    // REQUIRED FIELDS
    // ------------------------------------------

    if (
      !form.username.trim() ||
      !form.email.trim() ||
      !form.confirmEmail.trim() ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    // ------------------------------------------
    // EMAIL VALIDATION
    // ------------------------------------------

    if (!validateEmail(form.email)) {
      setError("Invalid email format.");
      setLoading(false);
      return;
    }

    // ------------------------------------------
    // CONFIRM EMAIL
    // ------------------------------------------

    if (form.email !== form.confirmEmail) {
      setError("Emails do not match.");
      setLoading(false);
      return;
    }

    // ------------------------------------------
    // PASSWORD STRENGTH
    // ------------------------------------------

    if (!isPasswordStrong) {
      setError(
        "Password must contain at least 8 characters, uppercase letter, lowercase letter, number, and special character."
      );
      setLoading(false);
      return;
    }

    // ------------------------------------------
    // CONFIRM PASSWORD
    // ------------------------------------------

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    // ------------------------------------------
    // REGISTER WITH STRAPI
    // ------------------------------------------

    try {
      await registerUser({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      alert("Registration successful! Please log in.");

      window.location.href = "/login";
    } catch (err: any) {
      console.error("Registration error:", err);

      console.error(
        "Strapi response:",
        err?.response?.data
      );

      const message =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        "Registration failed. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="flex items-center justify-center min-h-screen bg-background py-10 px-4">
      <div className="card w-full max-w-md">

        {/* ======================================
            TITLE
        ====================================== */}

        <h1 className="text-center text-3xl font-bold text-accent mb-6">
          Register
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {/* ====================================
              USERNAME
          ==================================== */}

          <InputField
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
          />

          {/* ====================================
              EMAIL
          ==================================== */}

          <InputField
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          {/* ====================================
              CONFIRM EMAIL
          ==================================== */}

          <InputField
            name="confirmEmail"
            placeholder="Confirm Email"
            value={form.confirmEmail}
            onChange={handleChange}
          />

          {/* ====================================
              PASSWORD
          ==================================== */}

          <PasswordField
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />

          {/* ====================================
              PASSWORD STRENGTH
          ==================================== */}

          {form.password.length > 0 && (
            <div className="rounded-lg border border-gray-700 bg-black/30 p-4">

              {/* Strength title */}
              <div className="flex items-center justify-between mb-3">

                <span className="text-sm text-gray-300">
                  Password Strength
                </span>

                <span
                  className={`text-sm font-semibold ${strengthText}`}
                >
                  {passwordStrength}
                </span>

              </div>

              {/* Strength bar */}
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mb-3">

                <div
                  className={`h-full ${strengthWidth} ${strengthColor} transition-all duration-300`}
                />

              </div>

              {/* Requirement count */}
              <p className="text-xs text-gray-400 mb-3">
                {passedChecks}/5 requirements completed
              </p>

              {/* ==================================
                  REQUIREMENT 1
              ================================== */}

              <div className="flex items-center gap-2 mb-2">

                <span>
                  {passwordChecks.length ? "✅" : "❌"}
                </span>

                <span
                  className={
                    passwordChecks.length
                      ? "text-green-400 text-sm"
                      : "text-gray-400 text-sm"
                  }
                >
                  At least 8 characters
                </span>

              </div>

              {/* ==================================
                  REQUIREMENT 2
              ================================== */}

              <div className="flex items-center gap-2 mb-2">

                <span>
                  {passwordChecks.uppercase ? "✅" : "❌"}
                </span>

                <span
                  className={
                    passwordChecks.uppercase
                      ? "text-green-400 text-sm"
                      : "text-gray-400 text-sm"
                  }
                >
                  Uppercase letter (A-Z)
                </span>

              </div>

              {/* ==================================
                  REQUIREMENT 3
              ================================== */}

              <div className="flex items-center gap-2 mb-2">

                <span>
                  {passwordChecks.lowercase ? "✅" : "❌"}
                </span>

                <span
                  className={
                    passwordChecks.lowercase
                      ? "text-green-400 text-sm"
                      : "text-gray-400 text-sm"
                  }
                >
                  Lowercase letter (a-z)
                </span>

              </div>

              {/* ==================================
                  REQUIREMENT 4
              ================================== */}

              <div className="flex items-center gap-2 mb-2">

                <span>
                  {passwordChecks.number ? "✅" : "❌"}
                </span>

                <span
                  className={
                    passwordChecks.number
                      ? "text-green-400 text-sm"
                      : "text-gray-400 text-sm"
                  }
                >
                  Number (0-9)
                </span>

              </div>

              {/* ==================================
                  REQUIREMENT 5
              ================================== */}

              <div className="flex items-start gap-2">

                <span>
                  {passwordChecks.special ? "✅" : "❌"}
                </span>

                <div>

                  <span
                    className={
                      passwordChecks.special
                        ? "text-green-400 text-sm"
                        : "text-gray-400 text-sm"
                    }
                  >
                    Special character
                  </span>

                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    Any special character is accepted, including:
                  </p>

                  <p className="text-xs text-gray-500 mt-1 leading-relaxed break-all">
                    ! @ # $ % ^ & * ( ) - _ + = [ ] {"{"} {"}"}
                    ; : &apos; &quot; , . &lt; &gt; / ? \ | ` ~
                  </p>

                </div>

              </div>

            </div>
          )}

          {/* ====================================
              CONFIRM PASSWORD
          ==================================== */}

          <PasswordField
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
          />

          {/* ====================================
              PASSWORD MATCH
          ==================================== */}

          {form.confirmPassword.length > 0 && (
            <p
              className={`text-sm ${
                form.password === form.confirmPassword
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {form.password === form.confirmPassword
                ? "✅ Passwords match"
                : "❌ Passwords do not match"}
            </p>
          )}

          {/* ====================================
              ERROR
          ==================================== */}

          {error && (
            <p className="text-danger text-sm">
              {error}
            </p>
          )}

          {/* ====================================
              REGISTER BUTTON
          ==================================== */}

          <SubmitButton
            label={
              loading
                ? "Registering..."
                : "Register"
            }
            disabled={loading}
          />

        </form>

        {/* ======================================
            LOGIN LINK
        ====================================== */}

        <p className="text-sm text-gray-400 text-center mt-4">

          Already have an account?{" "}

          <a
            href="/login"
            className="text-accent hover:underline"
          >
            Login here
          </a>

        </p>

      </div>
    </div>
  );
}