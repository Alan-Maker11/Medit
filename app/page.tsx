import Link from "next/link";
import FareCalculator from "@/components/FareCalculator";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-4 py-16 dark:bg-black">
      <div className="mb-6 w-full max-w-md">
        <a
          href="/meditiko/calculator"
          className="flex w-full transform items-center justify-center gap-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-orange-600 hover:to-orange-700 hover:shadow-xl"
        >
          <span className="text-2xl">🚗</span>
          <div className="text-left">
            <p className="font-bold">Meditiko Express</p>
            <p className="text-xs text-orange-100">Calcula tu tarifa express (0-7km) — público</p>
          </div>
        </a>
      </div>

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
