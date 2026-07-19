import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import {
  baihulingPanoramaTour,
  type PanoramaLanguage
} from "@/content/panoramaTour";
import { generateGeminiCulturalGuide } from "@/lib/geminiCurator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const supportedLanguages = new Set<PanoramaLanguage>(["zh-Hant", "zh-Hans", "en"]);

function resolvePanoramaContext(contentId: string) {
  const content = baihulingPanoramaTour.content[contentId];
  if (!content) {
    return null;
  }
  const node = baihulingPanoramaTour.nodes.find((candidate) =>
    candidate.infoHotspots.some((hotspot) => hotspot.contentId === contentId)
  );
  if (!node) {
    return null;
  }
  return { content, panoramaSrc: node.panorama.src };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "请求不是有效 JSON。", code: "INVALID_JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "请求内容无效。", code: "INVALID_REQUEST" }, { status: 400 });
  }
  const record = body as Record<string, unknown>;
  const contentId = typeof record.contentId === "string" ? record.contentId : "";
  const language = supportedLanguages.has(record.language as PanoramaLanguage)
    ? (record.language as PanoramaLanguage)
    : null;
  const question = typeof record.question === "string" ? record.question.trim().slice(0, 400) : "";
  if (!contentId || !language || !question) {
    return NextResponse.json(
      { error: "请选择有效热点、语言并输入问题。", code: "INVALID_REQUEST" },
      { status: 400 }
    );
  }

  const context = resolvePanoramaContext(contentId);
  if (!context) {
    return NextResponse.json({ error: "没有找到对应的策展热点。", code: "CONTENT_NOT_FOUND" }, { status: 404 });
  }

  const apiKey = process.env.GOOGLE_API_KEY ?? process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error: "Gemini 尚未配置。请在服务器环境变量中设置 GEMINI_API_KEY。",
        code: "GEMINI_NOT_CONFIGURED"
      },
      { status: 503 }
    );
  }

  try {
    const relativePanoramaPath = context.panoramaSrc.replace(/^\/+/, "");
    const absolutePanoramaPath = path.join(process.cwd(), "public", relativePanoramaPath);
    const panoramaBytes = await readFile(absolutePanoramaPath);
    const result = await generateGeminiCulturalGuide({
      apiKey,
      content: context.content,
      language,
      question,
      panoramaBase64: panoramaBytes.toString("base64"),
      panoramaMimeType: "image/png"
    });
    return NextResponse.json(result, {
      headers: { "cache-control": "no-store" }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gemini 请求失败。";
    return NextResponse.json(
      { error: `Gemini 暂时无法完成解读：${message}`, code: "GEMINI_REQUEST_FAILED" },
      { status: 502 }
    );
  }
}
