import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { AdminLoginForm } from "@/components/admin-login-form";
import { Download, Users, Award as AwardIcon } from "lucide-react";
import { adminLogout } from "./actions";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");

  if (!session) {
    return <AdminLoginForm />;
  }

  // Fetch Stats
  const nomineesCount = await prisma.nominee.count();
  const awards = await prisma.award.findMany({
    include: {
      _count: {
        select: { nominations: true },
      },
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">IT Dept Admin Dashboard</h1>
            </div>
            <div className="flex items-center">
              <form action={async () => {
                "use server";
                await adminLogout();
                redirect("/admin");
              }}>
                <button type="submit" className="text-gray-500 hover:text-gray-700 text-sm font-medium">
                    Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {/* Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
                <p className="text-sm text-gray-500">Track real-time nomination statistics.</p>
            </div>
            <a
                href="/api/export"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
                <Download className="w-4 h-4 mr-2" />
                Download Data (.xlsx)
            </a>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100">
                <div className="p-5">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                            <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">Total Nominees</dt>
                                <dd className="text-3xl font-bold text-gray-900">{nomineesCount}</dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Breakdown by Award */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Nominations by Category</h3>
            </div>
            <ul className="divide-y divide-gray-200">
                {awards.map((award) => (
                    <li key={award.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <AwardIcon className="h-5 w-5 text-gray-400 mr-3" />
                                <p className="text-sm font-medium text-gray-900">{award.title}</p>
                            </div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {award._count.nominations} nominations
                            </span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
      </main>
    </div>
  );
}
