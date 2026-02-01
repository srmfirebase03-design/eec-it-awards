"use server";

import { cookies } from "next/headers";

export async function adminLogin(prevState: any, formData: FormData) {
  const pin = formData.get("pin");

  if (pin === "admin123") {
    // Set cookie
    (await cookies()).set("admin_session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });
    return { success: true };
  } else {
    return { success: false, message: "Invalid PIN" };
  }
}

export async function adminLogout() {
  (await cookies()).delete("admin_session");
}
