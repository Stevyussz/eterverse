"use client";

import { useActionState, useState, useTransition } from "react";
import { CheckCircle, WarningCircle, PaperPlaneTilt } from "@phosphor-icons/react";
import { saveVotifier, testVotifier, type VotifierFormState } from "./actions";

interface Props {
  serverId: string;
  serverName: string;
  enabled: boolean;
  host: string;
  port: number;
  hasKey: boolean;
  lastResult: string;
  lastSentAt: string | null;
}

const initial: VotifierFormState = { status: "idle", message: "" };

const inputClass =
  "w-full rounded-lg border border-zinc-800 bg-black px-3 py-2.5 text-sm text-white font-mono placeholder:text-zinc-500 focus:border-zinc-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60";

function Feedback({ state }: { state: VotifierFormState }) {
  if (state.status === "idle") return null;
  const ok = state.status !== "error";
  return (
    <p
      role={ok ? "status" : "alert"}
      className={`flex items-start gap-2 text-sm ${ok ? "text-emerald-300" : "text-rose-300"}`}
    >
      {ok ? <CheckCircle size={18} className="shrink-0 mt-0.5" aria-hidden /> : <WarningCircle size={18} className="shrink-0 mt-0.5" aria-hidden />}
      <span>{state.message}</span>
    </p>
  );
}

export function VotifierForm(props: Props) {
  const [saveState, saveAction, saving] = useActionState(saveVotifier.bind(null, props.serverId), initial);
  const [testState, setTestState] = useState<VotifierFormState>(initial);
  const [testing, startTest] = useTransition();
  const [testName, setTestName] = useState("");
  const id = props.serverId;

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-950/90 p-5 sm:p-6 flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-lg font-semibold text-white">{props.serverName}</h2>
        {props.lastSentAt && (
          <span className={`text-xs font-mono ${props.lastResult === "ok" ? "text-emerald-300" : "text-rose-300"}`}>
            Pengiriman terakhir: {props.lastResult === "ok" ? "berhasil" : `gagal (${props.lastResult})`},{" "}
            {new Date(props.lastSentAt).toLocaleString("id-ID")}
          </span>
        )}
      </div>

      <form action={saveAction} className="flex flex-col gap-4">
        <label className="flex items-center gap-3 min-h-[44px] cursor-pointer">
          <input
            type="checkbox"
            name="enabled"
            defaultChecked={props.enabled}
            className="h-5 w-5 accent-white"
          />
          <span className="text-sm text-zinc-200">Kirim hadiah in-game setiap pemain vote server ini</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-[1fr_140px] gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-mono text-zinc-300">Host Votifier</span>
            <input name="host" defaultValue={props.host} placeholder="play.servermu.id" className={inputClass} autoComplete="off" />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-mono text-zinc-300">Port</span>
            <input name="port" type="number" inputMode="numeric" min={1} max={65535} defaultValue={props.port} className={inputClass} />
          </label>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-mono text-zinc-300">
            Public key {props.hasKey && <span className="text-emerald-300">(sudah tersimpan, kosongkan untuk tetap memakai yang lama)</span>}
          </span>
          <textarea
            name="publicKey"
            rows={4}
            spellCheck={false}
            placeholder="Isi file plugins/Votifier/rsa/public.key (MIIBIjANBgkq...)"
            className={`${inputClass} resize-y`}
          />
        </label>

        <Feedback state={saveState} />

        <button
          type="submit"
          disabled={saving}
          className="self-start min-h-[44px] px-5 rounded-md bg-white text-zinc-950 font-semibold text-sm hover:bg-zinc-200 transition-colors disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {saving ? "Menyimpan..." : "Simpan Pengaturan"}
        </button>
      </form>

      <div className="border-t border-zinc-800 pt-5 flex flex-col gap-3">
        <p className="text-sm text-zinc-300">
          Tes koneksi: kirim satu vote palsu ke server untuk memastikan hadiah bisa sampai.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <label className="flex-1">
            <span className="sr-only">Nama Minecraft untuk vote tes</span>
            <input
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              placeholder="Nama Minecraft kamu (opsional)"
              maxLength={17}
              className={inputClass}
            />
          </label>
          <button
            type="button"
            disabled={testing}
            onClick={() => startTest(async () => setTestState(await testVotifier(id, testName.trim())))}
            className="min-h-[44px] px-5 rounded-md border border-zinc-700 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 hover:border-zinc-500 transition-colors disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <PaperPlaneTilt size={16} aria-hidden />
            {testing ? "Mengirim..." : "Kirim Vote Tes"}
          </button>
        </div>
        <Feedback state={testState} />
      </div>
    </section>
  );
}
