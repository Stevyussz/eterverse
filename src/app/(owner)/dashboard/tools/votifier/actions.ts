"use server";

import mongoose from "mongoose";
import { auth } from "@/auth";
import connectToDatabase from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { normalizePublicKey, sendVotifierVote, type VotifierResult } from "@/lib/votifier";
import { Server } from "@/models/Server";

export interface VotifierFormState {
  status: "idle" | "saved" | "tested" | "error";
  message: string;
}

const REASON_TEXT: Record<Exclude<VotifierResult, { ok: true }>["reason"], string> = {
  invalid_key: "Public key tidak valid. Salin seluruh isi file plugins/Votifier/rsa/public.key.",
  blocked_host: "Host mengarah ke alamat privat/lokal. Pakai IP publik atau domain server kamu.",
  dns: "Domain tidak ditemukan. Cek ejaan host.",
  timeout: "Server tidak merespons dalam 4 detik. Pastikan port Votifier terbuka di panel hosting.",
  connect: "Koneksi ditolak. Cek host, port, dan apakah plugin Votifier sudah jalan.",
  protocol: "Yang menjawab di port itu bukan Votifier. Cek nomor port di config Votifier.",
};

async function ownedServer(serverId: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId || !mongoose.Types.ObjectId.isValid(serverId)) return null;
  await connectToDatabase();
  return Server.findOne({ _id: serverId, ownerId: userId }).select(
    "_id name +votifier.host +votifier.port +votifier.publicKey votifier.enabled"
  );
}

export async function saveVotifier(
  serverId: string,
  _prev: VotifierFormState,
  formData: FormData
): Promise<VotifierFormState> {
  const server = await ownedServer(serverId);
  if (!server) return { status: "error", message: "Server tidak ditemukan atau bukan milikmu." };

  const enabled = formData.get("enabled") === "on";
  const host = String(formData.get("host") || "").trim().slice(0, 253);
  const port = Number(formData.get("port"));
  const rawKey = String(formData.get("publicKey") || "");

  if (enabled) {
    if (!host) return { status: "error", message: "Isi host Votifier (IP atau domain server)." };
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      return { status: "error", message: "Port harus angka 1-65535 (default Votifier: 8192)." };
    }
  }

  let publicKey = server.votifier?.publicKey || "";
  if (rawKey.trim()) {
    const normalized = normalizePublicKey(rawKey);
    if (!normalized) return { status: "error", message: REASON_TEXT.invalid_key };
    publicKey = normalized;
  }
  if (enabled && !publicKey) return { status: "error", message: "Tempel public key Votifier dulu." };

  await Server.updateOne(
    { _id: server._id },
    {
      $set: {
        "votifier.enabled": enabled,
        "votifier.host": host,
        "votifier.port": Number.isInteger(port) && port > 0 ? port : 8192,
        "votifier.publicKey": publicKey,
      },
    }
  );

  return {
    status: "saved",
    message: enabled
      ? "Tersimpan. Hadiah vote aktif. Kirim vote tes untuk memastikan koneksinya."
      : "Tersimpan. Hadiah vote dimatikan.",
  };
}

export async function testVotifier(serverId: string, username: string): Promise<VotifierFormState> {
  const server = await ownedServer(serverId);
  if (!server) return { status: "error", message: "Server tidak ditemukan atau bukan milikmu." };

  const v = server.votifier;
  if (!v?.host || !v.publicKey) {
    return { status: "error", message: "Simpan host, port, dan public key dulu sebelum tes." };
  }

  // Each test opens a TCP connection from our infrastructure; keep it to a handful per minute.
  const limit = await rateLimit(`vtest:${serverId}`, 5, 60);
  if (!limit.ok) return { status: "error", message: "Terlalu sering tes. Tunggu satu menit." };

  const name = /^[.*]?[A-Za-z0-9_]{3,16}$/.test(username) ? username : "EterVerseTest";
  const result = await sendVotifierVote({
    host: v.host,
    port: v.port || 8192,
    publicKey: v.publicKey,
    username: name,
    address: "127.0.0.1",
  });

  await Server.updateOne(
    { _id: server._id },
    { $set: { "votifier.lastResult": result.ok ? "ok" : result.reason, "votifier.lastSentAt": new Date() } }
  );

  if (result.ok) {
    return {
      status: "tested",
      message: `Vote tes terkirim atas nama ${name}. Cek console server: harus muncul log vote dari layanan "EterVerse".`,
    };
  }
  return { status: "error", message: REASON_TEXT[result.reason] };
}
