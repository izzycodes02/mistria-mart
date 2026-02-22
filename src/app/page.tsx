import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Hello!</h1>
      <hr />
      <h2 className="font-bold text-lg my-2">Fake Navigation (for now):</h2>
      <ul className="list-disc ml-8">
        <li>
          <Link
            href="/login"
            className="text-blue-600 hover:text-blue-400 hover:underline"
          >
            Login Page
          </Link>
        </li>
        <li>
          <Link
            href="/signup"
            className="text-red-600 hover:text-red-400 hover:underline"
          >
            Sign Up Page
          </Link>
        </li>
        <li>
          <Link
            href="/login/admin"
            className="text-purple-600 hover:text-purple-400 hover:underline"
          >
            Admin Login Page
          </Link>
        </li>
        <li>
          <Link
            href="/admin"
            className="text-green-600 hover:text-green-400 hover:underline"
          >
            Admin Dashboard Page
          </Link>
        </li>
        <li>
          <Link
            href="/admin/asu"
            className="text-orange-600 hover:text-orange-400 hover:underline"
          >
            Admin Sign Up Page
          </Link>
        </li>
      </ul>
    </div>
  );
}
