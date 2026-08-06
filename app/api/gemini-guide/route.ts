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
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 8;
const requestBuckets = new Map<string, { count: number; resetAt: number }>();

function getClientKey(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? request.headers.get("x-real-ip")
    ?? "anonymous";
}

function isRateLimited(request: Request) {
  const now = Date.now();
  const key = getClientKey(request);
  const bucket = requestBuckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    requestBuckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  bucket.count += 1;
  return bucket.count > RATE_LIMIT_MAX_REQUESTS;
}

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
        error: "AI 导览当前未开放；原著展签、全景、小游戏和奖励仍可完整体验。",
        code: "GEMINI_NOT_CONFIGURED"
      },
      { status: 503 }
    );
  }

  if (isRateLimited(request)) {
    return NextResponse.json(
      { error: "AI 导览请求过于频繁，请一分钟后再试。", code: "RATE_LIMITED" },
      { status: 429, headers: { "retry-after": "60" } }
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
  } catch {
    return NextResponse.json(
      { error: "AI 导览暂时无法完成解读，请稍后再试。", code: "GEMINI_REQUEST_FAILED" },
      { status: 502 }
    );
  }
}
