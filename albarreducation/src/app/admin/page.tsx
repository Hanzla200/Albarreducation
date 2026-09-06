/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStoredUser, isAdminUser } from "../../lib/auth";
import Link from "next/link";

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = getStoredUser();
    setUser(storedUser);
    setLoading(false);

    if (isAdminUser(storedUser)) {
      router.push("/admin/dashboard");
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-accent text-xl">Loading Admin Panel...</p>
      </div>
    );
  }

  if (!user || !isAdminUser(user)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <div className="card text-center max-w-md">
          <h1 className="text-2xl font-bold text-accent mb-4">Admin Access Required</h1>
          <p className="text-gray-400 mb-6">
            You must be logged in with an administrator account to access this area.
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/login" className="btn btn-primary">
              Go to Login
            </Link>
            <Link href="/" className="btn btn-secondary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="card text-center">
        <p className="text-accent">Redirecting to Admin Dashboard...</p>
      </div>
    </div>
  );
}
