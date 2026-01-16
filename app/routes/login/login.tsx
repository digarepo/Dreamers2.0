export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const { login, setAuthCookie } = await import("~/services/auth.server");

  const user = await login(username, password);
  if (!user) {
    return { error: "Invalid username or password" };
  }

  // Role-based redirect
  let redirectTo = "/";
  if (["ADMIN", "MASTER_ENCODER", "SHAREHOLDER_ENCODER"].includes(user.role)) {
    redirectTo = "/sample";
  } else if (user.role === "DEPOSIT_ENCODER") {
    redirectTo = "/deposit";
  } else if (user.role === "AUDITOR") {
    redirectTo = "/reports";
  } else if (user.role === "ATTENDANCE_ENCODER") {
    redirectTo = "/attendance";
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: redirectTo,
      "Set-Cookie": setAuthCookie(user),
    },
  });
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-12 w-full max-w-lg">
        <h1 className="text-4xl font-bold text-center text-green-900 mb-10">
          Login to Riders Share
        </h1>

        <form method="post" className="space-y-8">
          <input
            name="username"
            type="text"
            required
            placeholder="Username"
            className="w-full px-6 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500"
          />

          <input
            name="password"
            type="password"
            required
            placeholder="Password"
            className="w-full px-6 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500"
          />

          <button
            type="submit"
            className="w-full bg-green-700 hover:bg-green-800 text-white font-bold text-2xl py-5 rounded-xl transition"
          >
            Login
          </button>
        </form>
            
        <p className="mt-8 text-center  text-gray-600">
          <a href="/forgot-password" className="text-green-600 hover:underline">Forgot Password</a>
        </p>
        {/* Back to Home */}
        <p className="mt-8 text-center text-gray-600">
          <a href="/" className="text-green-700 hover:underline">Back to Home</a>
        </p>
      </div>
    </div>
  );
}