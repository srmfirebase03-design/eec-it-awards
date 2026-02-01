import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const nominees = await prisma.nominee.findMany({
      include: {
        nominations: {
          include: {
            award: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const awards = await prisma.award.findMany();

    const wb = XLSX.utils.book_new();

    // 1. Master Sheet (All Nominations)
    const masterData = nominees.map((n) => ({
      "Unique ID": n.uniqueId,
      Name: n.name,
      "Reg No": n.regNo,
      "Email": n.email,
      "Mobile": n.mobile,
      "Year": n.year,
      "Section": n.section,
      "Awards Selected": n.nominations.map(nom => nom.award.title).join(", "),
      "Submitted At": n.createdAt.toLocaleString(),
    }));

    const wsMaster = XLSX.utils.json_to_sheet(masterData);
    XLSX.utils.book_append_sheet(wb, wsMaster, "All Nominees");

    // 2. Sheets per Award
    for (const award of awards) {
      // Filter nominees who selected this award
      const awardNominees = nominees.filter((n) =>
        n.nominations.some((nom) => nom.awardId === award.id)
      );

      if (awardNominees.length > 0) {
        const sheetData = awardNominees.map((n) => ({
          "Unique ID": n.uniqueId,
          Name: n.name,
          "Reg No": n.regNo,
          "Year": n.year,
          "Section": n.section,
          "Email": n.email,
          "Mobile": n.mobile,
        }));

        // Sheet names have limit of 31 chars
        const safeSheetName = award.title.slice(0, 30).replace(/[:\/\\?*[\]]/g, ""); 
        
        const ws = XLSX.utils.json_to_sheet(sheetData);
        XLSX.utils.book_append_sheet(wb, ws, safeSheetName);
      }
    }

    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename="nomination_data_${new Date().toISOString().split('T')[0]}.xlsx"`,
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to generate export" }, { status: 500 });
  }
}
