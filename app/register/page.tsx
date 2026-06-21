"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  UserPlus,
  User,
  CheckCircle2,
} from "lucide-react";
import "../login/login.css";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // ── Password strength indicators ──
  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };
  const passedChecks = Object.values(passwordChecks).filter(Boolean).length;

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
        // Not authenticated — show register
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
    if (!name.trim()) {
      setError("Please enter your full name");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }
    if (!password.trim()) {
      setError("Please enter a password");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Registration failed");
        setIsLoading(false);
        return;
      }

      // Success — redirect to admin (cookie already set by API)
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
            maxWidth: "440px",
            padding: "36px 36px",
          }}
        >
          {/* Logo */}
          <div className="login-logo">
            <UserPlus
              size={28}
              strokeWidth={1.5}
              style={{ color: "#d4a574" }}
            />
          </div>

          {/* Title */}
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <h1
              style={{
                fontSize: "24px",
                fontWeight: 700,
                color: "#f0f0f0",
                marginBottom: "8px",
                letterSpacing: "-0.3px",
              }}
            >
              Create Account
            </h1>
            <p
              style={{
                fontSize: "14px",
                color: "rgba(255,255,255,0.4)",
                fontWeight: 400,
              }}
            >
              Register to access the admin dashboard
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
            {/* Full Name */}
            <div style={{ marginBottom: "14px" }}>
              <label
                htmlFor="register-name"
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.5)",
                  marginBottom: "8px",
                }}
              >
                Full Name
              </label>
              <div
                className="login-input-group"
                style={{ position: "relative" }}
              >
                <User size={18} className="login-input-icon" />
                <input
                  id="register-name"
                  type="text"
                  className="login-input"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  autoFocus
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: "14px" }}>
              <label
                htmlFor="register-email"
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
              <div
                className="login-input-group"
                style={{ position: "relative" }}
              >
                <Mail size={18} className="login-input-icon" />
                <input
                  id="register-email"
                  type="email"
                  className="login-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: "6px" }}>
              <label
                htmlFor="register-password"
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
              <div
                className="login-input-group"
                style={{ position: "relative" }}
              >
                <Lock size={18} className="login-input-icon" />
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  className="login-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
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

            {/* Password Strength Indicator */}
            {password.length > 0 && (
              <div style={{ marginBottom: "14px" }}>
                {/* Strength bar */}
                <div
                  style={{
                    display: "flex",
                    gap: "4px",
                    marginBottom: "8px",
                  }}
                >
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: "3px",
                        borderRadius: "2px",
                        transition: "all 0.3s ease",
                        background:
                          passedChecks >= i
                            ? passedChecks <= 1
                              ? "#ef4444"
                              : passedChecks <= 2
                                ? "#f59e0b"
                                : passedChecks <= 3
                                  ? "#3b82f6"
                                  : "#22c55e"
                            : "rgba(255,255,255,0.08)",
                      }}
                    />
                  ))}
                </div>
                {/* Checklist */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "4px",
                  }}
                >
                  {[
                    { key: "length" as const, label: "8+ characters" },
                    { key: "uppercase" as const, label: "Uppercase" },
                    { key: "lowercase" as const, label: "Lowercase" },
                    { key: "number" as const, label: "Number" },
                  ].map((check) => (
                    <div
                      key={check.key}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "11px",
                        color: passwordChecks[check.key]
                          ? "rgba(34,197,94,0.8)"
                          : "rgba(255,255,255,0.25)",
                        transition: "color 0.2s ease",
                      }}
                    >
                      <CheckCircle2 size={12} />
                      <span>{check.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Confirm Password */}
            <div style={{ marginBottom: "24px" }}>
              <label
                htmlFor="register-confirm"
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.5)",
                  marginBottom: "8px",
                }}
              >
                Confirm Password
              </label>
              <div
                className="login-input-group"
                style={{ position: "relative" }}
              >
                <Lock size={18} className="login-input-icon" />
                <input
                  id="register-confirm"
                  type={showConfirm ? "text" : "password"}
                  className="login-input"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  disabled={isLoading}
                  style={
                    confirmPassword.length > 0 && confirmPassword !== password
                      ? { borderColor: "rgba(239, 68, 68, 0.4)" }
                      : confirmPassword.length > 0 &&
                          confirmPassword === password
                        ? { borderColor: "rgba(34, 197, 94, 0.4)" }
                        : {}
                  }
                />
                <button
                  type="button"
                  className="login-pw-toggle"
                  onClick={() => setShowConfirm(!showConfirm)}
                  tabIndex={-1}
                  aria-label={
                    showConfirm ? "Hide password" : "Show password"
                  }
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {confirmPassword.length > 0 && confirmPassword !== password && (
                <p
                  style={{
                    fontSize: "11px",
                    color: "#fca5a5",
                    marginTop: "6px",
                    paddingLeft: "4px",
                  }}
                >
                  Passwords do not match
                </p>
              )}
            </div>

            {/* Submit */}
            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="login-spinner" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="login-divider" />

          {/* Link to login */}
          <p
            style={{
              textAlign: "center",
              fontSize: "13px",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            Already have an account?{" "}
            <Link
              href="/login"
              style={{
                color: "#d4a574",
                fontWeight: 500,
                textDecoration: "none",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
