"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [role, setRole] = useState("patient");
  const [error, setError] = useState("");

  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam === "patient" || roleParam === "insurer") {
      setRole(roleParam);
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset error before request

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      const response = await fetch(
        "https://claims-management-platform.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      // Store the authentication token securely
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({ role, email }));

      // Redirect based on role
      if (role === "patient") {
        router.push("/patient/dashboard");
      } else {
        router.push("/insurer/dashboard");
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Login to ClaimEase
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </div>

        <Tabs defaultValue={role} onValueChange={setRole} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="patient">Patient</TabsTrigger>
            <TabsTrigger value="insurer">Insurer</TabsTrigger>
          </TabsList>
          <TabsContent value="patient">
            <Card>
              <CardHeader>
                <CardTitle>Patient Login</CardTitle>
                <CardDescription>
                  Access your patient portal to submit and track claims
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="patient-email">Email</Label>
                    <Input
                      id="patient-email"
                      name="email"
                      type="email"
                      placeholder="patient@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patient-password">Password</Label>
                    <Input
                      id="patient-password"
                      name="password"
                      type="password"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          <TabsContent value="insurer">
            <Card>
              <CardHeader>
                <CardTitle>Insurer Login</CardTitle>
                <CardDescription>
                  Access your insurer portal to manage and process claims
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="insurer-email">Email</Label>
                    <Input
                      id="insurer-email"
                      name="email"
                      type="email"
                      placeholder="insurer@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="insurer-password">Password</Label>
                    <Input
                      id="insurer-password"
                      name="password"
                      type="password"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="px-8 text-center text-sm text-muted-foreground">
          <p>For demo purposes:</p>
          <p>Patient: patient@example.com / password</p>
          <p>Insurer: insurer@example.com / password</p>
        </div>
      </div>
    </div>
  );
}
