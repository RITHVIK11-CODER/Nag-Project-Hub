"use client";

import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await supabaseBrowser.auth.signOut();

    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="border border-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-900"
    >
      Logout
    </button>
  );
}