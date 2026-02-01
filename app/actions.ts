"use server";

import { prisma } from "@/lib/db";
import { nominationSchema } from "@/lib/schema";
import { z } from "zod";

export type State = {
  success: boolean;
  message?: string;
  errors?: {
    [key: string]: string[];
  };
  uniqueId?: string;
};

export async function submitNomination(prevState: State, formData: FormData): Promise<State> {
  const rawData = {
    name: formData.get("name"),
    regNo: formData.get("regNo"),
    email: formData.get("email"),
    mobile: formData.get("mobile"),
    year: formData.get("year"),
    section: formData.get("section"),
    selectedAwards: formData.getAll("selectedAwards"),
  };

  const validatedFields = nominationSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Please fix the errors below.",
    };
  }

  const { email, regNo, selectedAwards } = validatedFields.data;

  try {
    // Check for duplicates
    const existingNominee = await prisma.nominee.findFirst({
      where: {
        OR: [
          { email: email },
          { regNo: regNo },
        ],
      },
    });

    if (existingNominee) {
      if (existingNominee.email === email) {
        return { success: false, message: "This email has already been registered." };
      }
      if (existingNominee.regNo === regNo) {
        return { success: false, message: "This registration number has already been registered." };
      }
    }

    // Verify awards exist
    const awards = await prisma.award.findMany({
      where: {
        id: {
          in: selectedAwards
        }
      }
    });

    if (awards.length !== selectedAwards.length) {
       return { success: false, message: "One or more selected awards are invalid." };
    }

    // Generate Unique ID
    const uniqueId = `AW-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Create Entry
    await prisma.nominee.create({
      data: {
        uniqueId,
        name: validatedFields.data.name,
        regNo: validatedFields.data.regNo,
        email: validatedFields.data.email,
        mobile: validatedFields.data.mobile,
        year: validatedFields.data.year,
        section: validatedFields.data.section,
        nominations: {
          create: selectedAwards.map((awardId) => ({
            awardId: awardId,
          })),
        },
      },
    });

    return {
      success: true,
      message: "Nomination submitted successfully!",
      uniqueId: uniqueId,
    };

  } catch (error) {
    console.error("Submission error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
