import { beforeEach, describe, expect, it, vi } from "vitest";

const { generateGeminiCulturalGuide } = vi.hoisted(() => ({
  generateGeminiCulturalGuide: vi.fn()
}));

vi.mock("@/lib/geminiCurator", async () => {
  const actual = await vi.importActual<typeof import("@/lib/geminiCurator")>("@/lib/geminiCurator");
  return { ...actual, generateGeminiCulturalGuide };
});

describe("POST /api/gemini-guide", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    generateGeminiCulturalGuide.mockResolvedValue({
      answer: "测试解读",
      visualObservation: "测试画面",
      culturalContext: "测试语境",
      evidenceQuote: "峰巖重疊，澗壑彎環。",
      confidenceNote: "测试边界",
      model: "gemini-3.5-flash-001",
      source: { chapterNumber: 27, rawLineStart: 6997, rawLineEnd: 6998 },
      usage: { promptTokens: 10, outputTokens: 10 }
    });
    delete process.env.GEMINI_API_KEY;
    delete process.env.GOOGLE_API_KEY;
  });

  it("never accepts source passages or panorama paths from the browser", async () => {
    process.env.GEMINI_API_KEY = "server-only-test-key";
    const { POST } = await import("./route");
    const response = await POST(
      new Request("http://localhost/api/gemini-guide", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          contentId: "content-baihuling-landscape",
          language: "zh-Hans",
          question: "为什么这里显得危险？",
          originalTraditional: "伪造原文",
          panoramaPath: "/private/secret.png"
        })
      })
    );

    expect(response.status).toBe(200);
    expect(generateGeminiCulturalGuide).toHaveBeenCalledOnce();
    const call = generateGeminiCulturalGuide.mock.calls[0][0];
    expect(call.content.originalTraditional).toContain("峰巖重疊，澗壑彎環");
    expect(call.panoramaBase64).toMatch(/^[A-Za-z0-9+/]+=*$/);
    expect(call).not.toHaveProperty("panoramaPath");
  });

  it("returns a clear configuration error without a server-side key", async () => {
    const { POST } = await import("./route");
    const response = await POST(
      new Request("http://localhost/api/gemini-guide", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          contentId: "content-baihuling-landscape",
          language: "en",
          question: "What does the mountain setting communicate?"
        })
      })
    );

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({ code: "GEMINI_NOT_CONFIGURED" });
  });

  it("rejects unknown hotspots before calling Gemini", async () => {
    process.env.GEMINI_API_KEY = "server-only-test-key";
    const { POST } = await import("./route");
    const response = await POST(
      new Request("http://localhost/api/gemini-guide", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ contentId: "not-real", language: "en", question: "Explain this." })
      })
    );

    expect(response.status).toBe(404);
    expect(generateGeminiCulturalGuide).not.toHaveBeenCalled();
  });
});
