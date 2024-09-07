import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to the App</h1>
        <Link
          href="/auth/login"
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Login
        </Link>
        <br />
        <Link
          href="/auth/signup"
          className="bg-green-500 text-white py-2 px-4 rounded mt-4 inline-block"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
