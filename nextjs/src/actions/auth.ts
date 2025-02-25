// src/lib/auth.ts
import { auth } from "@clerk/nextjs/server";

export async function getUserAuth() {
    return auth();
}
