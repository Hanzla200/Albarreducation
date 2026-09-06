"use client";

import { useEffect, useState } from "react";
import InputField from "../../components/forms/inputfield";
import PasswordField from "../../components/forms/passwordfield";
import SubmitButton from "../../components/forms/submitbutton";
import { loginUser } from "../../services/authservic";
import api from "../../services/api";
import { getStoredJwt, isAdminUser, setStoredUser } from "../../lib/auth";

export default function LoginPage() {
  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const jwt = getStoredJwt();

    if (!jwt) return;

    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (isAdminUser(user)) {
      window.location.href = "/admin";
    } else {
      window.location.href = "/student";
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    if (!form.identifier || !form.password) {
      setError("Please enter your email/username and password.");
      setLoading(false);
      return;
    }

    try {
      const res = await loginUser(form);

      const jwt = res.data?.jwt;

      if (!jwt) {
        throw new Error("Authentication failed");
      }

      localStorage.setItem("jwt", jwt);

      let user = res.data?.user;

      if (!user) {
        const userRes = await api.get("/users/me");
        user = userRes.data;
      }

      setStoredUser(user);

      if (isAdminUser(user)) {
        window.location.href = "/admin";
      } else {
        window.location.href = "/student";
      }
    } catch {
      setError("Invalid credentials or backend unavailable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="card">
        <h1 className="text-center text-3xl font-bold text-accent mb-6">
          Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            name="identifier"
            placeholder="Email or Username"
            value={form.identifier}
            onChange={handleChange}
          />

          <PasswordField
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />

          {error && (
            <p className="text-danger text-sm">
              {error}
            </p>
          )}

          <SubmitButton
            label={loading ? "Logging in..." : "Login"}
            disabled={loading}
          />
        </form>

        <div className="text-center mt-6 space-y-2 text-sm text-gray-400">
          <p>
            Forgot your password?{" "}
            <a
              href="/forgetpassword"
              className="text-accent hover:underline"
            >
              Reset here
            </a>
          </p>

          <p>
            Don’t have an account?{" "}
            <a
              href="/register"
              className="text-accent hover:underline"
            >
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}