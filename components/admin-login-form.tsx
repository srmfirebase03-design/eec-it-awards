"use client";

import { useActionState } from "react";
import { adminLogin } from "@/app/admin/actions";
import { Loader2 } from "lucide-react";

export function AdminLoginForm() {
  const [state, action, isPending] = useActionState(adminLogin, { success: false });

  if (state.success) {
      window.location.reload(); // Simple reload to refresh server state
      return <div className="text-center">Redirecting...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Admin Access</h2>
        <form action={action} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Access PIN</label>
            <input
              type="password"
              name="pin"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter PIN"
            />
          </div>
          {state.message && (
            <p className="text-red-500 text-sm text-center">{state.message}</p>
          )}
          <button
            type="submit"
            disabled={isPending}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
          >
            {isPending ? <Loader2 className="animate-spin w-4 h-4" /> : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
