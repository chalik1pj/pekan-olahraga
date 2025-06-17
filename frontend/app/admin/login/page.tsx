"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Lock, Loader2, Shield } from "lucide-react";
import toast from "react-hot-toast";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/login",
        data
      );

      if (response.data.status === "success") {
        // Store token in localStorage
        localStorage.setItem("adminToken", response.data.token);
        toast.success("Login berhasil!");
        router.push("/admin/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Username atau password salah");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <Link
          href="/"
          className="inline-flex items-center text-primary mb-8 hover:underline transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Beranda
        </Link>

        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-heading font-bold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Masuk ke panel administrasi Pekan Olahraga 2025
          </p>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                className="input-field"
                placeholder="Masukkan username Anda"
                {...register("username")}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                className="input-field"
                placeholder="Masukkan password Anda"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Masuk...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-5 w-5" />
                    Masuk ke Admin Panel
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Panel administrasi khusus untuk pengelola Pekan Olahraga 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
