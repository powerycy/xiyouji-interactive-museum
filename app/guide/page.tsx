import Link from "next/link";
import type { Metadata } from "next";
import { AppFrame } from "@/components/AppFrame";

export const metadata: Metadata = {
  title: "使用手册｜西游镜界",
  description: "西游镜界评委体验路径、兼容性与隐私说明。"
};

const steps = [
  ["01", "从取经地图进山", "首页已选中白虎岭。点“进入白虎岭全景”，无需注册或登录。"],
  ["02", "按原著证据走完 4 幕", "在 360° 场景里拖动寻找白色热点；也可点“原著证据导览 · 11 条”，按故事顺序直接打开展签。"],
  ["03", "核对原文与解释", "每张展签都能切换原文、简释和 English，并标出《西游记》第二十七回的原始文本行号。"],
  ["04", "完成真相时间线", "读完 9 条核心线索后进入小游戏。评委可点“加载演示答案”，再正常校验，快速查看完整闭环。"],
  ["05", "领取本回奖励", "通过后打开奖励页，查看白骨夫人图鉴和下一章节线索。"]
];

export default function GuidePage() {
  return (
    <AppFrame variant="museum-light">
      <main className="hackathon-guide">
        <section className="hackathon-guide-hero">
          <p>评委使用手册 · 约 3 分钟</p>
          <h1>西游镜界</h1>
          <h2>原著证据驱动的 AI 360°互动博物馆</h2>
          <p>
            这不是让 AI 随口讲名著。每个互动结论先绑定可核对的原著，再让 360°场景、小游戏和可选的多模态导览围绕证据展开。
          </p>
          <div className="hackathon-guide-actions">
            <Link href="/" className="primary-button">开始体验</Link>
            <Link href="/chapter/027" className="hackathon-guide-secondary">直接进入白虎岭</Link>
          </div>
        </section>

        <section className="hackathon-guide-section" aria-labelledby="guide-path-title">
          <div className="hackathon-guide-heading">
            <p>推荐路径</p>
            <h2 id="guide-path-title">5 步看完核心闭环</h2>
          </div>
          <ol className="hackathon-guide-steps">
            {steps.map(([number, title, body]) => (
              <li key={number}>
                <span>{number}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="hackathon-guide-grid">
          <article>
            <p>无密钥也能完整体验</p>
            <h2>核心功能不依赖 Gemini</h2>
            <p>
              地图、4 个 360°场景、11 条展签、探索进度、时间线游戏和奖励都在没有 API Key 时正常工作。Gemini 是展签内的可选增强：服务端收到问题后，同时读取当前全景与对应原文证据，再返回受证据约束的解读。
            </p>
          </article>
          <article>
            <p>兼容与回退</p>
            <h2>WebGL 失败也不断线</h2>
            <p>
              推荐最新版 Chrome、Safari 或 Edge。若设备无法加载 WebGL，会自动显示静态场景；“原著证据导览”仍可读完全部展签并解锁小游戏。手机端支持触控浏览和底部展签。
            </p>
          </article>
          <article>
            <p>隐私与用量</p>
            <h2>不登录、不上传进度</h2>
            <p>
              探索进度只保存在当前浏览器的 localStorage。站点不要求账号，也未接入行为分析。只有主动向 Gemini 提问时，问题与当前公开展签上下文才会发往服务端；API Key 不会下发到浏览器。
            </p>
          </article>
          <article>
            <p>内容边界</p>
            <h2>一回做深，不冒充全书完成</h2>
            <p>
              当前完整开放《西游记》第二十七回“三打白骨精”。地图上的其他节点用于说明可扩展结构，锁定节点不代表已制作章节。所有原著行号来自仓库内保存的公开文本。
            </p>
          </article>
        </section>
      </main>
    </AppFrame>
  );
}
