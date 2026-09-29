<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import UnlockBadge from '@/components/payment/UnlockBadge.vue';
import { NAV_ABOUT, NAV_DESIGNER } from '@/core/copy';

/**
 * 顶部栏：品牌印记（Logo + 产品名）+ 解锁徽标 + 关于入口。
 *
 * ★ 产品名直接写入 UI（本轮「印章制作软件」），不由 core/copy.ts 注入，
 *   以保持业务核心只读；导航文案仍取自 core/copy.ts（禁用词单一防线）。
 */

/** 本轮产品名（UI 内产品名，按 TASK.md 应用）。 */
const PRODUCT_NAME = '印章制作软件';

/** 品牌 Logo 资源地址（避免模板内使用 import.meta）。 */
const logoUrl = `${import.meta.env.BASE_URL}brand-logo.png`;

const route = useRoute();

/** 当前是否处于关于页。 */
const onAbout = computed<boolean>(() => route.name === 'about');
</script>

<template>
  <header class="app-header">
    <div class="app-header__brand">
      <img
        class="app-header__logo"
        :src="logoUrl"
        :alt="`${PRODUCT_NAME} 标志`"
        draggable="false"
      />
      <h1 class="app-header__title">{{ PRODUCT_NAME }}</h1>
    </div>
    <nav class="app-header__nav" :aria-label="PRODUCT_NAME">
      <RouterLink class="app-header__link" :class="{ 'is-active': !onAbout }" to="/designer">
        {{ NAV_DESIGNER }}
      </RouterLink>
      <RouterLink class="app-header__link" :class="{ 'is-active': onAbout }" to="/about">
        {{ NAV_ABOUT }}
      </RouterLink>
    </nav>
    <div class="app-header__right">
      <UnlockBadge />
    </div>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  gap: var(--space-5);
  flex: 0 0 auto;
  height: var(--header-height);
  padding: 0 var(--space-5);
  background-color: var(--color-background);
  border-bottom: 1px solid var(--studio-border);
  box-shadow: var(--shadow-subtle);
}

.app-header__brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding-right: var(--space-5);
  border-right: 1px solid var(--studio-border);
}

.app-header__logo {
  width: 28px;
  height: 28px;
  object-fit: contain;
  border-radius: var(--radius-sm);
  user-select: none;
}

.app-header__title {
  margin: 0;
  font-size: var(--text-sm);
  line-height: var(--text-sm-lh);
  font-weight: var(--weight-semibold);
  letter-spacing: 0.04em;
  color: var(--color-foreground);
  white-space: nowrap;
}

.app-header__nav {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  margin-right: auto;
}

.app-header__link {
  padding: 6px var(--space-3);
  border-radius: var(--radius-base);
  font-size: var(--text-xs);
  line-height: var(--text-xs-lh);
  font-weight: var(--weight-medium);
  color: var(--fg-60);
  text-decoration: none;
  transition:
    background-color var(--transition-interactive),
    color var(--transition-interactive);
}

.app-header__link:hover {
  background-color: var(--fg-8);
  color: var(--color-foreground);
}

.app-header__link:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

.app-header__link.is-active {
  background-color: var(--accent-soft);
  color: var(--accent-strong);
}

.app-header__right {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
</style>
