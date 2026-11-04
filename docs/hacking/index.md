---
title: Hacking · 渗透知识库
hide:
  - toc
---

<!-- Primary: find a topic. Secondary: choose domain/source. Tertiary: provenance.
Reuse existing #12394a / #087f8c palette and 8/16/24/32 spacing; no framework. -->
<div class="hacking-hero">
<span class="hacking-label">HACKING / KNOWLEDGE LIBRARY</span>
<h1>少翻几个站，<br>多找到一点思路。</h1>
<p>把分散的渗透知识，放在同一个入口。中文查主题，跨库找资料，回到原文深入阅读。</p>
<a href="#catalog">开始查找 ↓</a>
</div>

<div class="hacking-paths">
<a href="guide/">从哪里开始 <span>六个方向的中文阅读路线 ↗</span></a>
<a href="sources/">了解来源 <span>各知识库适合查什么 ↗</span></a>
</div>

## 按你正在研究的问题查找 {#catalog}

<div id="hacking-browser" class="hacking-browser">
<label for="hacking-query">搜索主题、技术或工具</label>
<input id="hacking-query" type="search" placeholder="试试：证书、Kerberos、文件上传、容器…" autocomplete="off">
<div class="hacking-filters">
<label>方向<select id="hacking-category"><option value="">全部方向</option></select></label>
<label>来源<select id="hacking-source"><option value="">全部知识库</option></select></label>
<label>原文语言<select id="hacking-language"><option value="">全部语言</option><option>中文</option><option>英文</option></select></label>
<button id="hacking-clear" type="button">重置</button>
</div>
<p id="hacking-status" role="status" aria-live="polite">正在加载知识目录…</p>
<div id="hacking-results"></div>
<button id="hacking-more" type="button" hidden>继续显示</button>
</div>

<noscript>启用 JavaScript 可使用跨库筛选，或直接阅读下面的静态目录。</noscript>

### 按知识库浏览

[HackTricks 中文目录](hacktricks.md) · [The Hacker Recipes 目录](recipes.md) · [PayloadsAllTheThings 目录](payloads.md)

这里提供中文导读、公开文章目录与原文链接。搜索覆盖收录的标题、方向和中文关键词；英文文章仍由原站提供，尚未进行全文翻译，也不搜索外站正文。目录为定期手动更新的快照，更新时间显示在搜索结果上方。

<script src="../assets/hacking.js" defer></script>
