"use client";

import { FormField } from "@/components/common";
import { applyAppTheme } from "@/components/theme-sync";
import { Button } from "@/components/ui/button";
import { ROUTES, getPostLoginRoute } from "@/config";
import { useAuth } from "@/hooks";
import { useToast } from "@/hooks/use-toast";
import { whenSessionCookieSynced } from "@/lib/api";
import { ApiException } from "@/lib/api/errors";
import { getSafeInternalPath } from "@/lib/auth/protected-routes";
import { loginSchema } from "@/schemas";
import { authService } from "@/services";
import { superAdminAuthService } from "@/services/super-admin";
import { LoginResponse, SuperAdminLoginResponse } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";

type LoginFormProps = {
  loginType: "user" | "superAdmin";
};

export function LoginForm({ loginType }: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setTheme } = useTheme();
  const { setAuth } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const response =
        loginType === "user"
          ? await authService.login(data)
          : await superAdminAuthService.loginSuperAdmin(data);

      let redirectTo: string = ROUTES.DASHBOARD;

      if (loginType === "superAdmin") {
        const adminResponse = response as SuperAdminLoginResponse;
        const adminData = adminResponse.data;
        const accessToken = adminData?.accessToken;

        if (!accessToken || !adminData?.superAdmin) {
          throw new Error("Login succeeded but no session token was returned");
        }

        setAuth(adminData.superAdmin, null, accessToken);

        redirectTo = getPostLoginRoute(adminData.superAdmin.role);
      } else {
        const userData = response as LoginResponse;
        const accessToken = userData.accessToken;

        if (!accessToken || !userData.user) {
          throw new Error("Login succeeded but no session token was returned");
        }

        setAuth(userData.user, userData.tenant ?? null, accessToken);

        redirectTo = getPostLoginRoute(userData.user.role);
        if (userData.user.role === "OWNER") {
          applyAppTheme("light");
          setTheme("light");
        } else {
          applyAppTheme("dark");
          setTheme("dark");
        }
      }

      await whenSessionCookieSynced();

      toast({
        title: "You are signed in",
        description: "Opening your workspace…",
      });

      const nextPath = getSafeInternalPath(searchParams.get("next"));
      console.log("nextPath", nextPath, "redirectTo", redirectTo);
      router.push(nextPath ?? redirectTo);
    } catch (error) {
      const message =
        error instanceof ApiException
          ? error.getUserMessage()
          : "Login failed. Please try again.";

      console.log("message", message);

      toast({
        title: "Error",
        description: message,
        variant: "destructive",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField
        name="email"
        control={control}
        label="Email"
        type="email"
        placeholder="your@email.com"
        error={errors.email?.message}
        disabled={isLoading}
      />

      <FormField
        name="password"
        control={control}
        label="Password"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        disabled={isLoading}
      />

      <Button
        type="submit"
        className="w-full cursor-pointer"
        loading={isLoading}
      >
        Login
      </Button>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">
          Don&apos;t have an account?{" "}
        </span>
        <Link
          href={ROUTES.REGISTER}
          className="font-medium hover:underline cursor-pointer"
        >
          Register
        </Link>
      </div>

      {loginType === "user" ? (
        <div className="text-center text-sm">
          <Link
            href={ROUTES.FORGOT_PASSWORD}
            className="text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>
      ) : null}
    </form>
  );
}
