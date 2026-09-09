import { describe, it, expect, beforeEach } from "vitest";
import { detectPlatform, assetNameForTarget, latestDownloadUrl, PLATFORM_TO_TARGET, PLATFORM_LABEL } from "./platform";

describe("assetNameForTarget", () => {
  it("generates correct asset name with v-prefixed tag", () => {
    const name = assetNameForTarget("v5.0.0-alpha.8", "x86_64-pc-windows-msvc");
    expect(name).toBe("campus-auth-v5.0.0-alpha.8-x86_64-pc-windows-msvc.zip");
  });

  it("adds v prefix when tag lacks it", () => {
    const name = assetNameForTarget("5.0.0", "aarch64-apple-darwin");
    expect(name).toBe("campus-auth-v5.0.0-aarch64-apple-darwin.tar.gz");
  });

  it("uses tar.gz for non-Windows targets", () => {
    expect(assetNameForTarget("v1.0", "x86_64-unknown-linux-gnu")).toContain(".tar.gz");
    expect(assetNameForTarget("v1.0", "x86_64-apple-darwin")).toContain(".tar.gz");
  });

  it("uses zip for Windows targets", () => {
    expect(assetNameForTarget("v1.0", "x86_64-pc-windows-msvc")).toContain(".zip");
    expect(assetNameForTarget("v1.0", "aarch64-pc-windows-msvc")).toContain(".zip");
  });
});

describe("latestDownloadUrl", () => {
  it("constructs GitHub latest download URL", () => {
    const url = latestDownloadUrl("campus-auth-v1.0-x86_64-pc-windows-msvc.zip");
    expect(url).toBe("https://github.com/Misyra/Campus-Auth-rs/releases/latest/download/campus-auth-v1.0-x86_64-pc-windows-msvc.zip");
  });
});

describe("PLATFORM_TO_TARGET", () => {
  it("maps all platforms to valid targets", () => {
    expect(PLATFORM_TO_TARGET["windows-x64"]).toBe("x86_64-pc-windows-msvc");
    expect(PLATFORM_TO_TARGET["windows-arm64"]).toBe("aarch64-pc-windows-msvc");
    expect(PLATFORM_TO_TARGET["macos-arm64"]).toBe("aarch64-apple-darwin");
    expect(PLATFORM_TO_TARGET["macos-x64"]).toBe("x86_64-apple-darwin");
    expect(PLATFORM_TO_TARGET["linux-x64"]).toBe("x86_64-unknown-linux-gnu");
  });
});

describe("PLATFORM_LABEL", () => {
  it("has human-readable labels for all platforms", () => {
    expect(PLATFORM_LABEL["windows-x64"]).toBe("Windows x64");
    expect(PLATFORM_LABEL["macos-arm64"]).toBe("macOS Apple Silicon");
    expect(PLATFORM_LABEL["linux-x64"]).toBe("Linux x64");
  });
});

describe("detectPlatform", () => {
  beforeEach(() => {
    // 重置 navigator 模拟
    Object.defineProperty(globalThis, "navigator", {
      value: { userAgent: "", platform: "", userAgentData: undefined },
      writable: true,
      configurable: true,
    });
  });

  it("detects Windows x64", () => {
    Object.defineProperty(globalThis, "navigator", {
      value: { userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", platform: "Win32" },
      writable: true,
      configurable: true,
    });
    expect(detectPlatform()).toBe("windows-x64");
  });

  it("detects macOS Apple Silicon when UA has no Intel marker", () => {
    Object.defineProperty(globalThis, "navigator", {
      value: { userAgent: "Mozilla/5.0 (Macintosh; Mac OS X 10_15_7)", platform: "MacIntel" },
      writable: true,
      configurable: true,
    });
    expect(detectPlatform()).toBe("macos-arm64");
  });

  it("detects macOS Intel when UA contains Intel", () => {
    Object.defineProperty(globalThis, "navigator", {
      value: { userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)", platform: "MacIntel" },
      writable: true,
      configurable: true,
    });
    expect(detectPlatform()).toBe("macos-x64");
  });

  it("detects Linux x64", () => {
    Object.defineProperty(globalThis, "navigator", {
      value: { userAgent: "Mozilla/5.0 (X11; Linux x86_64)", platform: "Linux x86_64" },
      writable: true,
      configurable: true,
    });
    expect(detectPlatform()).toBe("linux-x64");
  });

  it("returns unknown when navigator is undefined", () => {
    Object.defineProperty(globalThis, "navigator", {
      value: undefined,
      writable: true,
      configurable: true,
    });
    expect(detectPlatform()).toBe("unknown");
  });
});
