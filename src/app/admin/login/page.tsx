import Link from 'next/link';

export default function AdminLogin() {
  return (
    <div>
      <h1>This is the Admin Login page</h1>

      <ul className="list-disc ml-8">
        <li>
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-400 hover:underline"
          >
            Home Page
          </Link>
        </li>
      </ul>
    </div>
  );
}
