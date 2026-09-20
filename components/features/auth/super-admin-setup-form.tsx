"use client";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config";
import { superAdminAuthService } from "@/services/super-admin";
import { CheckCircle2, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface PasswordStrength {
  score: number;
  message: string;
  color: string;
}

export function SuperAdminSetupForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  const checkPasswordStrength = (password: string): PasswordStrength => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z\d]/.test(password)) score++;

    if (score === 0)
      return { score: 0, message: "Too weak", color: "bg-red-500" };
    if (score <= 2) return { score, message: "Weak", color: "bg-orange-500" };
    if (score <= 3) return { score, message: "Fair", color: "bg-yellow-500" };
    if (score <= 4) return { score, message: "Good", color: "bg-blue-500" };
    return { score, message: "Strong", color: "bg-green-500" };
  };

  const passwordStrength = checkPasswordStrength(formData.password);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...setupData } = formData;

      const response = await superAdminAuthService.setupSuperAdmin(setupData);

      toast.success("Super admin created successfully! Please login.", {
        duration: 3000,
      });

      // Redirect to login page after successful setup

      router.push(`${ROUTES.LOGIN}`);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create super admin";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="relative w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg shadow-primary/30">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-foreground">
            Setup Complete!
          </h2>
          <p className="text-muted-foreground text-lg">
            Your super admin account has been successfully created.
          </p>
        </div>
        <div className="bg-secondary/10 border border-primary/30 rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-2">Email:</p>
          <p className="font-mono text-foreground font-semibold">
            {formData.email}
          </p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-left">
          <p className="text-sm font-semibold text-yellow-900 mb-2">
            ⚠️ Important Security Notice
          </p>
          <p className="text-sm text-yellow-800">
            Save these credentials securely. You will use them to log in to the
            admin dashboard. Do not share this information with anyone.
          </p>
        </div>
        <Button
          onClick={() => (window.location.href = "/auth/login")}
          className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/30"
          size="lg"
        >
          Go to Login
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-foreground">
            First Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="John"
              disabled={loading}
              className={`w-full pl-10 pr-4 py-3 bg-input rounded-lg transition
    ${
      errors.firstName
        ? "border-red-500 focus:ring-red-500"
        : "border-border focus:ring-primary/50"
    }
    border focus:outline-none focus:ring-2`}
            />

            {errors.firstName && (
              <p className="text-sm text-red-500">{errors.firstName}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-foreground">
            Last Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Doe"
              className={`w-full pl-10 pr-4 py-3 bg-input rounded-lg transition
    ${
      errors.lastName
        ? "border-red-500 focus:ring-red-500"
        : "border-border focus:ring-primary/50"
    }
    border focus:outline-none focus:ring-2`}
              disabled={loading}
            />
            {errors.lastName && (
              <p className="text-sm text-red-500">{errors.lastName}</p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-foreground">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="admin@gymflow.com"
            className={`w-full pl-10 pr-4 py-3 bg-input rounded-lg transition
    ${
      errors.email
        ? "border-red-500 focus:ring-red-500"
        : "border-border focus:ring-primary/50"
    }
    border focus:outline-none focus:ring-2`}
            disabled={loading}
          />

          {errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-semibold text-foreground">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a strong password"
            disabled={loading}
            className={`w-full pl-10 pr-4 py-3 bg-input rounded-lg transition
    ${
      errors.password
        ? "border-red-500 focus:ring-red-500"
        : "border-border focus:ring-primary/50"
    }
    border focus:outline-none focus:ring-2`}
          />

          {errors.password && (
            <p className="text-sm text-red-500">{errors.password}</p>
          )}

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition"
            disabled={loading}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>

        {formData.password && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-border rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full ${passwordStrength.color} transition-all`}
                  style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-muted-foreground">
                {passwordStrength.message}
              </span>
            </div>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li className="flex items-center gap-2">
                <span
                  className={
                    formData.password.length >= 8 ? "text-green-600" : ""
                  }
                >
                  {formData.password.length >= 8 ? "✓" : "○"} At least 8
                  characters
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span
                  className={
                    /[a-z]/.test(formData.password) &&
                    /[A-Z]/.test(formData.password)
                      ? "text-green-600"
                      : ""
                  }
                >
                  {/[a-z]/.test(formData.password) &&
                  /[A-Z]/.test(formData.password)
                    ? "✓"
                    : "○"}{" "}
                  Mix of uppercase and lowercase
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span
                  className={
                    /\d/.test(formData.password) ? "text-green-600" : ""
                  }
                >
                  {/\d/.test(formData.password) ? "✓" : "○"} At least one number
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span
                  className={
                    /[^a-zA-Z\d]/.test(formData.password)
                      ? "text-green-600"
                      : ""
                  }
                >
                  {/[^a-zA-Z\d]/.test(formData.password) ? "✓" : "○"} Special
                  character
                </span>
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-foreground">
          Confirm Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            className={`w-full pl-10 pr-4 py-3 bg-input rounded-lg transition
    ${
      errors.confirmPassword
        ? "border-red-500 focus:ring-red-500"
        : "border-border focus:ring-primary/50"
    }
    border focus:outline-none focus:ring-2`}
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition"
            disabled={loading}
          >
            {showConfirmPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {errors.confirmPassword && (
        <p className="text-sm text-red-500">{errors.confirmPassword}</p>
      )}

      <Button
        type="submit"
        loading={loading}
        className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/30 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 cursor-pointer"
        size="lg"
      >
        Create Super Admin Account
      </Button>
    </form>
  );
}
