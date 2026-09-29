// 印坊轮次冒烟 + 截图脚本（非 Tauri 浏览器模式）。
// 仅验证前端可达性与渲染结果；支付/解锁的真实 IPC 结果由 Windows CI 环境保证。
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..', '..');
const shotDir = resolve(root, 'docs/ui-baselines/轮次1');

const PORT = 4173;
const BASE = `http://localhost:${PORT}`;

function startPreview() {
  const env = { ...process.env };
  // 清理代理变量，避免 localhost 被代理拦截
  for (const k of ['HTTP_PROXY', 'HTTPS_PROXY', 'http_proxy', 'https_proxy', 'ALL_PROXY', 'all_proxy']) {
    delete env[k];
  }
  env.NO_PROXY = 'localhost,127.0.0.1';
  const p = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    cwd: root,
    stdio: 'ignore',
    env,
  });
  return p;
}

async function waitPort() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/`);
      if (r.ok) return true;
    } catch {
      /* not ready */
    }
    await sleep(500);
  }
  throw new Error('vite preview 未就绪');
}

const results = [];
function log(k, v) {
  results.push(`${k}: ${v}`);
  console.log(`[smoke] ${k}: ${v}`);
}

const preview = process.env.NO_SPAWN ? null : startPreview();
try {
  await waitPort();
  const browser = await chromium.launch({
    args: ['--no-sandbox', '--no-proxy-server'],
  });

  for (const vp of [
    { name: '1080x600', width: 1080, height: 600 },
    { name: '1360x900', width: 1360, height: 900 },
  ]) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(m.text());
    });

    await page.goto(`${BASE}/designer`, { waitUntil: 'networkidle' });
    // 等主界面渲染（boot 门控解除后 RouterView 出现 .designer）
    await page.waitForSelector('.designer', { timeout: 15000 });
    await sleep(800);

    const hasDesigner = (await page.locator('.designer').count()) > 0;
    const hasParam = (await page.locator('.panel.studio').count()) > 0;
    const hasPreview = (await page.locator('.stage__svg').count()) > 0;
    const svgChildren = await page.locator('.stage__svg svg > *').count();
    const hasLogo = (await page.locator('.app-header__logo').count()) > 0;
    const title = (await page.locator('.app-header__title').textContent())?.trim();

    log(`[${vp.name}] 主界面渲染`, hasDesigner ? 'PASS' : 'FAIL');
    log(`[${vp.name}] 右侧检查器`, hasParam ? 'PASS' : 'FAIL');
    log(`[${vp.name}] 预览SVG渲染(子节点=${svgChildren})`, svgChildren > 0 ? 'PASS' : 'FAIL');
    log(`[${vp.name}] 顶栏Logo`, hasLogo ? 'PASS' : 'FAIL');
    log(`[${vp.name}] 产品名`, title);

    await page.screenshot({ path: resolve(shotDir, `main-${vp.name}.png`) });

    // 打开支付弹窗（点击导出栏「开通」按钮）
    const unlockBtn = page.locator('.export-bar__slot--end button');
    if ((await unlockBtn.count()) > 0) {
      await unlockBtn.click();
      await page.waitForSelector('.pmodal', { timeout: 5000 }).catch(() => {});
      await sleep(500);
      const payOpen = (await page.locator('.pmodal').count()) > 0;
      const reviewInput = (await page.locator('#review-code-input').count()) > 0;
      log(`[${vp.name}] 支付弹窗出现`, payOpen ? 'PASS' : 'FAIL');
      log(`[${vp.name}] 审核测试码输入框`, reviewInput ? 'PASS' : 'FAIL');
      await page.screenshot({ path: resolve(shotDir, `pay-${vp.name}.png`) });
      // 关闭弹窗
      await page.locator('.pmodal__close').click().catch(() => {});
      await sleep(300);
    }

    // 关于页
    await page.locator('.app-header__link', { hasText: '关于' }).click();
    await page.waitForSelector('.about', { timeout: 5000 });
    await sleep(400);
    const aboutName = (await page.locator('.about__brand-name').textContent())?.trim();
    log(`[${vp.name}] 关于页产品名`, aboutName);
    await page.screenshot({ path: resolve(shotDir, `about-${vp.name}.png`) });

    if (errors.length) log(`[${vp.name}] 控制台错误`, errors.slice(0, 5).join(' | '));
    await ctx.close();
  }

  await browser.close();
} finally {
  if (preview) preview.kill('SIGTERM');
}

console.log('\n=== SMOKE SUMMARY ===');
console.log(results.join('\n'));
