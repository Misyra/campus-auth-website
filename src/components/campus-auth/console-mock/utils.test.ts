import { describe, it, expect } from "vitest";
import { fmtDuration, fmtShort, fmtFull, makeLog } from "./utils";

describe("fmtDuration", () => {
  it("formats seconds correctly", () => {
    expect(fmtDuration(0)).toBe("0h 0m 0s");
    expect(fmtDuration(59)).toBe("0h 0m 59s");
    expect(fmtDuration(60)).toBe("0h 1m 0s");
    expect(fmtDuration(302)).toBe("0h 5m 2s");
    expect(fmtDuration(3600)).toBe("1h 0m 0s");
    expect(fmtDuration(3661)).toBe("1h 1m 1s");
  });
});

describe("fmtShort", () => {
  it("formats time as HH:MM", () => {
    const d = new Date(2026, 8, 6, 18, 14, 51);
    expect(fmtShort(d)).toBe("18:14");
  });

  it("pads single digits", () => {
    const d = new Date(2026, 0, 1, 9, 5, 0);
    expect(fmtShort(d)).toBe("09:05");
  });
});

describe("fmtFull", () => {
  it("formats full datetime", () => {
    const d = new Date(2026, 8, 6, 18, 14, 51);
    expect(fmtFull(d)).toBe("2026-09-06 18:14:51");
  });
});

describe("makeLog", () => {
  it("creates log entry with provided time", () => {
    const log = makeLog("INFO", "monitor", "test message", "2026-09-06 18:14:51");
    expect(log.level).toBe("INFO");
    expect(log.source).toBe("monitor");
    expect(log.msg).toBe("test message");
    expect(log.time).toBe("2026-09-06 18:14:51");
    expect(log.seq).toBeGreaterThan(0);
  });

  it("increments sequence number", () => {
    const a = makeLog("INFO", "a", "first");
    const b = makeLog("WARN", "b", "second");
    expect(b.seq).toBe(a.seq + 1);
  });

  it("uses current time when not provided", () => {
    const before = Date.now();
    const log = makeLog("ERROR", "test", "msg");
    const after = Date.now();
    const logTime = new Date(log.time).getTime();
    expect(logTime).toBeGreaterThanOrEqual(before - 1000);
    expect(logTime).toBeLessThanOrEqual(after + 1000);
  });
});
