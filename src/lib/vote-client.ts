import { toast } from "sonner";

export type VoteOutcome =
  | { kind: "voted"; votes: number }
  | { kind: "already" }
  | { kind: "login" }
  | { kind: "error" };

// Shared by the desktop VoteButton and the mobile sticky bar so both handle every
// response the same way, including the login redirect that keeps the player on this page.
const USERNAME_KEY = "eterverse:mc-username";

export function getSavedUsername(): string {
  try {
    return localStorage.getItem(USERNAME_KEY) || "";
  } catch {
    return "";
  }
}

export async function submitVote(slug: string, username?: string): Promise<VoteOutcome> {
  try {
    if (username) {
      try {
        localStorage.setItem(USERNAME_KEY, username);
      } catch {
        // Private mode: the name just will not be prefilled next time.
      }
    }
    const res = await fetch(`/api/vote/${slug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(username ? { username } : {}),
    });
    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      if (data.reward === "sent") {
        toast.success("Vote masuk dan hadiah dikirim ke server.", {
          description: `Masuk ke server sebagai ${username} untuk mengambil hadiahnya.`,
        });
      } else if (data.reward === "failed") {
        toast.success("Vote masuk.", {
          description: "Hadiah in-game belum terkirim karena server tidak merespons. Kabari owner-nya.",
        });
      } else {
        toast.success("Vote masuk. Terima kasih sudah mendukung server ini.");
      }
      return { kind: "voted", votes: data.votes ?? 0 };
    }
    if (res.status === 401) {
      const loginUrl = `/login?callbackUrl=${encodeURIComponent(`/server/${slug}`)}`;
      toast("Login dulu untuk vote", {
        description: "Satu akun, satu vote per server setiap 24 jam.",
        action: { label: "Masuk", onClick: () => window.location.assign(loginUrl) },
      });
      return { kind: "login" };
    }
    if (data.error === "already_voted") {
      toast("Kamu sudah vote server ini hari ini", { description: "Vote lagi setelah 24 jam." });
      return { kind: "already" };
    }
    toast.error(data.message || "Vote gagal. Coba lagi sebentar lagi.");
    return { kind: "error" };
  } catch {
    toast.error("Koneksi bermasalah. Vote belum terkirim.");
    return { kind: "error" };
  }
}
