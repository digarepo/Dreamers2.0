
import { useState } from "react";

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const username = formData.get("username") as string;

 
  console.log(`[Forgot Password] Reset request for username: ${username}`);
  console.log(`[Mock Email Sent] Reset link: http://localhost:3000/reset-password?token= mock-token-for-${username}`);

  return { success: true, message: "Password reset link sent! Check console for mock link." };
}

export default function ForgotPassword() {
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const response = await fetch("/forgot-password", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (data.success) {
      setMessage(data.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-16 w-full max-w-md text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Forgot Password</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <input
            name="username"
            type="text"
            required
            placeholder="Enter your username"
            className="w-full px-6 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-2xl py-6 rounded-xl"
          >
            Send Reset Link
          </button>
        </form>

        {message && <p className="mt-8 text-green-600 font-medium text-lg">{message}</p>}

        <p className="mt-8 text-gray-600">
          <a href="/" className="text-blue-600 hover:underline">Back to Login</a>
        </p>
      </div>
    </div>
  );
}