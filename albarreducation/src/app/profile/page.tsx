/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import InputField from "../../components/forms/inputfield";
import PasswordField from "../../components/forms/passwordfield";
import SubmitButton from "../../components/forms/submitbutton";
import api from "../../services/api";
import { validateEmail, validatePassword } from "../../utils/validation";
import { getStoredJwt, isAdminUser, logoutUser, setStoredUser } from "../../lib/auth";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const jwt = getStoredJwt();
    if (!jwt) return;
    api
      .get("/users/me")
      .then((res) => {
        setUser(res.data);
        setStoredUser(res.data);
        setEmail(res.data.email);
      })
      .catch(() => setError("Failed to load profile."));
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!validateEmail(email)) {
      setError("Invalid email format");
      setLoading(false);
      return;
    }
    if (password && !validatePassword(password)) {
      setError("Weak password");
      setLoading(false);
      return;
    }
    if (password && password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      if (!user) {
        setError("Not authenticated");
        return;
      }
      await api.put(`/users/${user.id}`, { email, password });
      setSuccess("Profile updated successfully.");
    } catch {
      setError("Unable to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    window.location.href = "/login";
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="card text-center">
          <h1 className="text-2xl font-bold text-accent mb-4">No user logged in</h1>
          <p className="text-gray-400">Please <a href="/login" className="text-accent hover:underline">login</a> first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="card">
        <h1 className="text-center text-3xl font-bold text-accent mb-6">Profile</h1>
        <p className="text-gray-300 mb-4">Welcome, <span className="text-accent">{user.username}</span></p>
        <form onSubmit={handleUpdate} className="space-y-4">
          <InputField name="email" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <PasswordField name="password" placeholder="New Password (optional)" value={password} onChange={(e) => setPassword(e.target.value)} />
          <PasswordField name="confirmPassword" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          {error && <p className="text-danger text-sm">{error}</p>}
          {success && <p className="text-success text-sm">{success}</p>}
          <SubmitButton label="Update Profile" />
        </form>
        <div className="text-center mt-6 text-sm text-gray-400">
          {isAdminUser(user) ? <p>You are logged in as <span className="text-accent">Admin</span>. <a href="/admin" className="text-accent hover:underline">Go to Admin Panel</a></p> : <p>You are logged in as <span className="text-accent">Student</span>. <a href="/student" className="text-accent hover:underline">Go to Student Dashboard</a></p>}
        </div>
        <div className="mt-6"><button onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Logout</button></div>
      </div>
    </div>
  );
}
