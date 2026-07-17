'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Dumbbell } from 'lucide-react';
import { LoginForm } from '@/components/features/auth';

export default function LoginPage() {

  const [loginType, setLoginType] = useState<"user" | "superAdmin">("user");


  return (
    <div className="min-h-screen bg-gradient-to-br  from-background via-background to-secondary/20 flex items-center justify-center px- sm:px-4 py-12">
      {/* Background decorative elements */}

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-20"></div>
      </div>


      {/* Main content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Card container with gradient border effect */}
        <div className="relative group">
          {/* Gradient border */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-20 rounded-2xl blur transition duration-1000"></div>

          {/* Main card */}
          <div className="relative bg-card backdrop-blur-xl border border-border/50 rounded-2xl p-8 md:p-10 shadow-2xl">


            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-lg">
                  <Dumbbell className="w-8 h-8 text-primary-foreground" />
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-2">
                GymFlow
              </h1>
              <p className="text-muted-foreground text-sm md:text-base">
                Manage your gym with ease and power
              </p>
            </div>

            {/* Login Type Toggle */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex rounded-lg border bg-muted p-1">
                <button
                  type="button"
                  onClick={() => setLoginType("user")}
                  className={`px-4 py-2 text-sm font-medium rounded-md cursor-pointer transition-all ${loginType === "user"
                    ? "bg-background shadow text-foreground"
                    : "text-muted-foreground hover:text-foreground "
                    }`}
                >
                  User Login
                </button>

                <button
                  type="button"
                  onClick={() => setLoginType("superAdmin")}
                  className={`px-4 py-2 text-sm cursor-pointer font-medium rounded-md transition-all ${loginType === "superAdmin"
                    ? "bg-background shadow text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  Super Admin
                </button>
              </div>
            </div>

            {/* Form */}
            <LoginForm loginType={loginType} />

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/30"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-card text-muted-foreground">
                  New to GymFlow?
                </span>
              </div>
            </div>

            {/* Sign up CTA */}
            <Link
              href="/auth/register"
              className="flex items-center justify-center w-full px-4 py-3 rounded-lg bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20 hover:border-accent/50 transition-all duration-300 font-medium text-sm group"
            >
              Create an account
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Link>

            {/* Footer links */}
            <div className="mt-6 space-y-2 text-center text-xs md:text-sm">
              <div>
                <Link
                  href="/auth/forgot-password"
                  className="text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  Forgot your password?
                </Link>
              </div>
              <div className="text-muted-foreground">
                By signing in, you agree to our{' '}
                <Link href="/terms" className="text-primary hover:text-primary/80 transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="text-xs">
            <div className="text-primary font-bold">10K+</div>
            <div className="text-muted-foreground">Active Gyms</div>
          </div>
          <div className="text-xs">
            <div className="text-primary font-bold">99.9%</div>
            <div className="text-muted-foreground">Uptime</div>
          </div>
          <div className="text-xs">
            <div className="text-primary font-bold">24/7</div>
            <div className="text-muted-foreground">Support</div>
          </div>
        </div>
      </div>


    </div>
  );
}
