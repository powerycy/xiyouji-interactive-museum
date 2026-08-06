# 截图与封面清单

## 封面

- 文件：`cover.png`
- 尺寸：1080 × 1080
- 主标题：西游镜界
- 用途：报名封面、小红书首图、Open Graph 分享图

## 最终快照（报名最多 5 张）

1. `screenshots/01-map-entry.png`：取经地图、白虎岭默认选中、进入全景 CTA。
2. `screenshots/02-panorama-evidence-guide.png`：360°白虎岭首幕与 4 幕 11 条原著证据导览。
3. `screenshots/03-original-evidence-label.png`：全景中的三语文化展签、Gemini 入口、原著行号。
4. `screenshots/04-evidence-timeline-game.png`：8 张事件卡与 9 张证据卡组成的真相时间线。
5. `screenshots/05-chapter-reward.png`：通过校验后的白虎岭奖励页。

提交前检查：5 张图必须来自生产公网版本；不得出现 Next.js 开发浮层、浏览器密码提示、个人账号信息或测试域名。当前 04、05 仍需在生产服务上重拍以清除开发浮层，其他图片也会统一复拍。

## 审计前快照

`audit-before/` 保存改造前事实，不用于报名：地图当时被缺失的空间 iframe 遮成白屏；全景热点需要旋转寻找；游戏没有评委快捷路径；导航仍暴露 Studio。
