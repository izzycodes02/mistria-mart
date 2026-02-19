import Link from "next/link";

export default function Login() {
    return (
      <div>
        <h1>This is the login page</h1>

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
    
};
