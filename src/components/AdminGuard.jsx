import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Shield, Lock } from "lucide-react";

export default function AdminGuard({ children }) {
  const [status, setStatus] = useState("loading"); // loading | authorized | unauthorized
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me()
      .then((u) => {
        setUser(u);
        if (u && (u.role === "admin" || u.role === "user")) {
          setStatus("authorized");
        } else {
          setStatus("unauthorized");
        }
      })
      .catch(() => setStatus("unauthorized"));
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthorized") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-500 mb-6">
            You must be a logged-in staff member to access this page.
          </p>
          <button
            onClick={() => base44.auth.redirectToLogin(window.location.href)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            <Shield className="w-4 h-4 inline mr-2" />
            Staff Login
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}