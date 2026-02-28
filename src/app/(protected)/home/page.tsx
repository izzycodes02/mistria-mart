import Link from "next/link";

export default function Home() {
    return(
        <div className="min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold text-center pt-10">Welcome to Mistria Mart</h1>
            <p className="text-center pt-5">Your one-stop shop for all your needs!</p>

            <Link href="/" type="button" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 mx-auto block w-fit">Go Back</Link>
        </div>
    );
};
