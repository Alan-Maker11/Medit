import Link from "next/link";
import FareCalculator from "@/components/FareCalculator";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-4 py-16 dark:bg-black">
      <div className="mb-10 flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Calculate Your Ride Cost</h1>
        <p className="max-w-md text-zinc-600 dark:text-zinc-400">
          Medit assisted mobility transportation — Santo Domingo, Dominican Republic.
          Get an instant fare estimate before you book.
        </p>
      </div>
      <FareCalculator />
      <Link
        href="/login"
        className="mt-12 text-xs text-zinc-400 underline-offset-2 hover:underline dark:text-zinc-600"
      >
        Staff login
      </Link>
    </div>
  );
}
