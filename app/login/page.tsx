"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, AlertCircle, Shield } from "lucide-react";
import "./login.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // ── Redirect if already authenticated ──
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            router.replace("/admin");
            return;
          }
        }
      } catch {
        // Not authenticated — show login
      }
      setIsCheckingAuth(false);
    }
    checkAuth();
  }, [router]);

  // ── Form submit ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }
    if (!password.trim()) {
      setError("Please enter your password");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Invalid credentials");
        setIsLoading(false);
        return;
      }

      // Success — redirect to admin
      router.replace("/admin");
    } catch {
      setError("Network error. Please try again.");
      setIsLoading(false);
    }
  };

  // ── Show nothing while checking auth ──
  if (isCheckingAuth) {
    return (
      <div className="auth-skeleton">
        <div className="auth-skeleton-pulse" />
      </div>
    );
  }

  return (
    <div className="login-bg" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Grid pattern overlay */}
      <div className="login-grid-pattern" />

      {/* Floating orbs */}
      <div className="login-orb login-orb-1" />
      <div className="login-orb login-orb-2" />
      <div className="login-orb login-orb-3" />

      {/* Main container */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "24px",
        }}
      >
        <div
          className="login-card login-fade-in"
          style={{
            width: "100%",
            maxWidth: "420px",
            padding: "40px 36px",
          }}
        >
          {/* Logo */}
          <div className="login-logo">
            <Shield
              size={28}
              strokeWidth={1.5}
              style={{ color: "#d4a574" }}
            />
          </div>

          {/* Title */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h1
              style={{
                fontSize: "24px",
                fontWeight: 700,
                color: "#f0f0f0",
                marginBottom: "8px",
                letterSpacing: "-0.3px",
              }}
            >
              Welcome Back
            </h1>
            <p
              style={{
                fontSize: "14px",
                color: "rgba(255,255,255,0.4)",
                fontWeight: 400,
              }}
            >
              Sign in to access the admin dashboard
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="login-error" style={{ marginBottom: "20px" }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: "16px" }}>
              <label
                htmlFor="login-email"
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.5)",
                  marginBottom: "8px",
                }}
              >
                Email Address
              </label>
              <div className="login-input-group" style={{ position: "relative" }}>
                <Mail size={18} className="login-input-icon" />
                <input
                  id="login-email"
                  type="email"
                  className="login-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  autoFocus
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: "24px" }}>
              <label
                htmlFor="login-password"
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.5)",
                  marginBottom: "8px",
                }}
              >
                Password
              </label>
              <div className="login-input-group" style={{ position: "relative" }}>
                <Lock size={18} className="login-input-icon" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  className="login-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="login-pw-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="login-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="login-spinner" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="login-divider" />

          {/* Footer */}
          <p
            style={{
              textAlign: "center",
              fontSize: "12px",
              color: "rgba(255,255,255,0.25)",
              lineHeight: 1.6,
            }}
          >
            Protected area · Authorized personnel only
          </p>
        </div>
      </div>
    </div>
  );
}
