import type { LogEntry, LogLevel } from "./types";

let seqCounter = 0;

export function fmtDuration(total: number): string {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${h}h ${m}m ${s}s`;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function fmtShort(d: Date): string {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function fmtFull(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export function makeLog(level: LogLevel, source: string, msg: string, time?: string): LogEntry {
  seqCounter += 1;
  return { seq: seqCounter, time: time ?? fmtFull(new Date()), level, source, msg };
}
