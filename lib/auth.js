"use server";

import { api } from "@/convex/_generated/api";
import { fetchMutation } from "convex/nextjs";

export async function signUp(payload) {
  try {
    const result = await fetchMutation(api.signUp.signUp, payload);
    console.log(result);
    return result;
  } catch (error) {
    console.error("Signup error:", error);
    return { success: false, error: "Signup failed. Please try again." };
  }
}
