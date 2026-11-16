"use server";

import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import connectToDatabase from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import { invalidateServerLists } from "@/lib/server-queries";
import { checkAndStore } from "@/lib/server-status";
import { Server } from "@/models/Server";

// Every admin mutation in one place, each one checking the caller is an admin and the id is
// a real ObjectId (a malformed id used to throw a CastError and 500 the admin page).

async function target(formData: FormData) {
  await requireAdmin();
  const serverId = String(formData.get("serverId") || "");
  if (!mongoose.Types.ObjectId.isValid(serverId)) return null;
  await connectToDatabase();
  return serverId;
}

function refresh() {
  revalidatePath("/admin");
  revalidatePath("/admin/database");
  invalidateServerLists();
}

function reasonFrom(formData: FormData, fallback: string) {
  return String(formData.get("reason") || "").trim().slice(0, 500) || fallback;
}

export async function approveServer(formData: FormData) {
  const id = await target(formData);
  if (!id) return;
  await Server.findByIdAndUpdate(id, { moderationStatus: "APPROVED", rejectionReason: "" });
  refresh();
}

export async function rejectServer(formData: FormData) {
  const id = await target(formData);
  if (!id) return;
  const rejectionReason = reasonFrom(formData, "Belum memenuhi standar listing EterVerse.");
  await Server.findByIdAndUpdate(id, { moderationStatus: "REJECTED", rejectionReason });
  refresh();
}

export async function banServer(formData: FormData) {
  const id = await target(formData);
  if (!id) return;
  // Stored in rejectionReason so the owner dashboard can show why.
  const rejectionReason = reasonFrom(formData, "Melanggar aturan EterVerse.");
  await Server.findByIdAndUpdate(id, { moderationStatus: "BANNED", rejectionReason });
  refresh();
}

export async function unbanServer(formData: FormData) {
  const id = await target(formData);
  if (!id) return;
  await Server.findByIdAndUpdate(id, { moderationStatus: "APPROVED", rejectionReason: "" });
  refresh();
}

export async function deleteServer(formData: FormData) {
  const id = await target(formData);
  if (!id) return;
  await Server.findByIdAndDelete(id);
  refresh();
}

export async function togglePartner(formData: FormData) {
  const id = await target(formData);
  if (!id) return;
  const server = await Server.findById(id).select("isEterShopPartner");
  if (!server) return;
  await Server.updateOne({ _id: id }, { isEterShopPartner: !server.isEterShopPartner });
  refresh();
}

/** Pings a server on demand: lets the admin check a pending submission is a real, live server. */
export async function pingServerNow(formData: FormData) {
  const id = await target(formData);
  if (!id) return;
  const server = await Server.findById(id).select("_id ipAddress port platform serverType").lean();
  if (!server) return;
  await checkAndStore(server as any);
  revalidatePath("/admin");
  revalidatePath("/admin/database");
}
