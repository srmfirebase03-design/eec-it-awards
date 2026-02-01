import { prisma } from "@/lib/db";
import { NominationForm } from "@/components/nomination-form";

export const dynamic = "force-dynamic";

export default async function Home() {
  const awards = await prisma.award.findMany();

  return (
    <main className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <NominationForm awards={awards} />
      
      <footer className="mt-16 border-t border-slate-200 pt-8 text-center">
        <p className="text-sm font-semibold text-slate-900">IT Department, Easwari Engineering College</p>
        <p className="text-xs text-slate-500 mt-2">&copy; {new Date().getFullYear()} All rights reserved. • Powered by Next.js</p>
      </footer>
    </main>
  );
}