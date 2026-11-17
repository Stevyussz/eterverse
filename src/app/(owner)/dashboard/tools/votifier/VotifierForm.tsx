"use client";

import { useActionState, useState, useTransition } from "react";
import { PixelIcon } from "@/components/pixel/PixelIcon";
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

const inputClass = "px-input font-mono text-sm";

function Feedback({ state }: { state: VotifierFormState }) {
  if (state.status === "idle") return null;
  const ok = state.status !== "error";
  return (
    <p role={ok ? "status" : "alert"} className={`px-note text-sm ${ok ? "" : "px-note-error px-shake"}`}>
      <PixelIcon name={ok ? "check" : "alert"} size={16} className={`shrink-0 mt-0.5 ${ok ? "text-online-d" : "text-redstone"}`} />
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
    <section className="px-panel p-5 sm:p-6 flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="px-title text-xl text-ink">{props.serverName}</h2>
        {props.lastSentAt && (
          <span className={`px-chip ${props.lastResult === "ok" ? "px-chip-prism" : "!bg-redstone-l"}`}>
            <PixelIcon name={props.lastResult === "ok" ? "check" : "alert"} size={11} />
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
            className="h-5 w-5 accent-[#1D5E57]"
          />
          <span className="text-sm text-ink">Kirim hadiah in-game setiap pemain vote server ini</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-[1fr_140px] gap-4">
          <label className="flex flex-col gap-2">
            <span className="px-label !mb-0">Host Votifier</span>
            <input name="host" defaultValue={props.host} placeholder="play.servermu.id" className={inputClass} autoComplete="off" />
          </label>
          <label className="flex flex-col gap-2">
            <span className="px-label !mb-0">Port</span>
            <input name="port" type="number" inputMode="numeric" min={1} max={65535} defaultValue={props.port} className={inputClass} />
          </label>
        </div>

        <label className="flex flex-col gap-2">
          <span className="px-label !mb-0">
            Public key {props.hasKey && <span className="font-sans text-sm text-online-d">(sudah tersimpan, kosongkan untuk tetap memakai yang lama)</span>}
          </span>
          <textarea
            name="publicKey"
            rows={4}
            spellCheck={false}
            placeholder="Isi file plugins/Votifier/rsa/public.key (MIIBIjANBgkq...)"
            className={`${inputClass} !min-h-[110px] resize-y`}
          />
        </label>

        <Feedback state={saveState} />

        <button
          type="submit"
          disabled={saving}
          className="px-btn self-start"
        >
          {saving ? "Menyimpan" : "Simpan pengaturan"}
        </button>
      </form>

      <div className="border-t-2 border-dashed border-ink/15 pt-5 flex flex-col gap-4">
        <p className="text-sm text-ink-2">
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
            className="px-btn px-btn-gold"
          >
            <PixelIcon name="send" size={14} />
            {testing ? "Mengirim" : "Kirim vote tes"}
          </button>
        </div>
        <Feedback state={testState} />
      </div>
    </section>
  );
}
