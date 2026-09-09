export type LogLevel = "INFO" | "WARN" | "ERROR";

export type LogEntry = { seq: number; time: string; level: LogLevel; source: string; msg: string };

export type HistoryEntry = { time: string; duration: string; profile: string; source: string; ok: boolean };
