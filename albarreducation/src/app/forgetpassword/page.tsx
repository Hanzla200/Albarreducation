  "use client";
import { useState } from "react";
import InputField from "../../components/forms/inputfield";
import SubmitButton from "../../components/forms/submitbutton";
import { forgotPassword } from "../../services/authservic";
import { validateEmail } from "../../utils/validation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!validateEmail(email)) {
      setError("Invalid email format");
      setLoading(false);
      return;
    }

    try {
      await forgotPassword(email);
      setSuccess("Password reset email sent! Check your inbox.");
    } catch {
      setError("Error sending reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="card">
        <h1 className="text-center text-3xl font-bold text-accent mb-6">Forgot Password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            name="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && <p className="text-danger text-sm">{error}</p>}
          {success && <p className="text-green-400 text-sm">{success}</p>}
          <SubmitButton label={loading ? "Sending..." : "Send Reset Link"} disabled={loading} />
        </form>

        {/* ✅ Links back to Login and Register */}
        <div className="text-center mt-6 space-y-2 text-sm text-gray-400">
          <p>
            Remembered your password?{" "}
            <a href="/login" className="text-accent hover:underline">Login here</a>
          </p>
          <p>
            Don’t have an account?{" "}
            <a href="/register" className="text-accent hover:underline">Register</a>
          </p>
        </div>
      </div>
    </div>
  );
}

