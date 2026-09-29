<script setup lang="ts">
import AdjustCard from './AdjustCard.vue';
import BorderCard from './BorderCard.vue';
import CenterCard from './CenterCard.vue';
import ColorCard from './ColorCard.vue';
import FangzhangTextCard from './FangzhangTextCard.vue';
import FontCard from './FontCard.vue';
import FreeTextCard from './FreeTextCard.vue';
import GongzhangTextCard from './GongzhangTextCard.vue';
import PresetCard from './PresetCard.vue';
import RealisticCard from './RealisticCard.vue';
import ShapeTypeCard from './ShapeTypeCard.vue';
import { PANEL_TITLE } from '@/core/copy';
import { useDesignStore } from '@/stores/design';

/**
 * 参数检查器（右侧常驻）：负责卡片顺序编排与按版式显隐（架构设计 §3.4）。
 *
 * ★ 本组件**不接收任何 props**，卡片同样不接收 props，各自直连
 *   `useDesignStore()`。这是本项目刻意选择的"务实耦合"，避免 12 层透传。
 *
 * ★ 本轮视觉：印坊风右侧检查器 —— 宣纸暖面 + 朱砂强调 + 折叠分组（accordion）。
 */

const s = useDesignStore();
</script>

<template>
  <aside class="panel studio" :aria-label="PANEL_TITLE">
    <div class="panel__scroll">
      <details class="acc" open>
        <summary class="acc__summary">预设方案</summary>
        <div class="acc__body"><PresetCard /></div>
      </details>

      <details class="acc" open>
        <summary class="acc__summary">版式与边框</summary>
        <div class="acc__body">
          <ShapeTypeCard />
          <BorderCard />
        </div>
      </details>

      <details class="acc" open>
        <summary class="acc__summary">文字内容</summary>
        <div class="acc__body">
          <CenterCard v-if="s.gongzhangActive" />
          <GongzhangTextCard v-if="s.gongzhangActive" />
          <FangzhangTextCard v-if="s.fangzhangActive" />
          <FreeTextCard v-if="s.freeActive" />
        </div>
      </details>

      <details class="acc" open>
        <summary class="acc__summary">精调</summary>
        <div class="acc__body">
          <AdjustCard />
          <ColorCard />
          <FontCard />
        </div>
      </details>

      <details class="acc" open>
        <summary class="acc__summary">做旧效果</summary>
        <div class="acc__body"><RealisticCard /></div>
      </details>
    </div>
  </aside>
</template>

<style scoped>
.panel {
  flex: 0 0 var(--panel-width);
  width: var(--panel-width);
  min-width: var(--panel-width);
  display: flex;
  flex-direction: column;
  min-height: 0;
  /* 印坊风：宣纸暖面 + 左侧细分隔（检查器在右） */
  border-left: 1px solid var(--studio-border);
  background-color: var(--studio-face);
  font-family: var(--studio-font);
}

.panel__scroll {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-3);
  padding-bottom: calc(var(--space-3) + 24px);
}

/* ── 细滚动条（暖棕） ── */
.panel__scroll::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

.panel__scroll::-webkit-scrollbar-track {
  background: transparent;
}

.panel__scroll::-webkit-scrollbar-thumb {
  background: var(--studio-border-strong);
  border: 2px solid var(--studio-face);
  border-radius: 6px;
}

.panel__scroll::-webkit-scrollbar-thumb:hover {
  background: var(--studio-text-dim);
}

/* ════════════ 折叠分组（accordion） ════════════ */
.acc {
  border: 1px solid var(--studio-border);
  border-radius: var(--studio-radius);
  background-color: var(--studio-surface);
  box-shadow: var(--studio-shadow);
  overflow: hidden;
}

.acc__summary {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: 10px var(--space-3);
  font-size: var(--text-xs);
  line-height: var(--text-xs-lh);
  font-weight: var(--weight-semibold);
  color: var(--studio-text);
  cursor: pointer;
  user-select: none;
  list-style: none;
  border-bottom: 1px solid transparent;
  transition: background-color var(--transition-interactive);
}

.acc__summary::-webkit-details-marker {
  display: none;
}

/* 朱砂细线：区块标题下的强调 */
.acc__summary::before {
  content: '';
  width: 3px;
  height: 14px;
  border-radius: var(--radius-full);
  background-color: var(--studio-line);
  flex: 0 0 auto;
}

.acc__summary::after {
  content: '';
  margin-left: auto;
  width: 8px;
  height: 8px;
  border-right: 2px solid var(--studio-text-dim);
  border-bottom: 2px solid var(--studio-text-dim);
  transform: rotate(45deg);
  transition: transform var(--duration-interactive) var(--ease-out);
}

.acc[open] > .acc__summary {
  border-bottom-color: var(--studio-border);
}

.acc[open] > .acc__summary::after {
  transform: rotate(-135deg);
}

.acc__summary:hover {
  background-color: var(--studio-surface-2);
}

.acc__summary:focus-visible {
  outline: 2px solid var(--studio-accent-ring);
  outline-offset: -2px;
}

.acc__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-3);
}

/* ════════════ 卡片（检查器内） ════════════ */
.panel :deep(.paper-card) {
  background-color: transparent;
  border: none;
  border-radius: 0;
  outline: none;
  overflow: visible;
  box-shadow: none;
}

.panel :deep(.paper-card__head) {
  display: flex;
  align-items: baseline;
  gap: var(--space-2);
  padding: 0 0 var(--space-2);
  border-bottom: 1px solid var(--studio-border);
}

.panel :deep(.paper-card__title) {
  font-size: var(--text-xs);
  line-height: var(--text-xs-lh);
  font-weight: 600;
  color: var(--studio-text);
}

.panel :deep(.paper-card__hint) {
  font-size: 12px;
  line-height: 16px;
  color: var(--studio-text-dim);
  margin-right: auto;
}

.panel :deep(.paper-card__body) {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-3) 0 0;
}

.panel :deep(.paper-card.is-compact .paper-card__body) {
  padding: var(--space-3) 0 0;
  gap: var(--space-2);
}

/* 字段标题 */
.panel :deep(.seg-field__label),
.panel :deep(.slider__label),
.panel :deep(.pinput__label),
.panel :deep(.pselect__label),
.panel :deep(.ptoggle__label) {
  font-size: var(--text-xs);
  line-height: var(--text-xs-lh);
  font-weight: 600;
  color: var(--studio-text);
}

.panel :deep(.slider__value),
.panel :deep(.pinput__count),
.panel :deep(.pselect__hint),
.panel :deep(.ptoggle__hint) {
  font-size: 12px;
  line-height: 16px;
  color: var(--studio-text-dim);
}

/* 分段选择器 → 朱砂胶囊分段 */
.panel :deep(.seg) {
  display: flex;
  gap: var(--space-1);
  padding: 3px;
  background-color: var(--studio-surface-2);
  border: 1px solid var(--studio-border);
  border-radius: var(--studio-radius);
  outline: none;
}

.panel :deep(.seg__item) {
  flex: 1 1 0;
  min-width: 0;
  padding: 4px var(--space-2);
  border: 1px solid transparent;
  border-radius: calc(var(--studio-radius) - 1px);
  background-color: transparent;
  color: var(--studio-text-dim);
  font-size: var(--text-xs);
  line-height: var(--text-xs-lh);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  transition: var(--transition-interactive);
}

.panel :deep(.seg__item:hover:not(:disabled):not(.is-active)) {
  background-color: var(--studio-surface);
  color: var(--studio-text);
}

.panel :deep(.seg__item:focus-visible) {
  outline: 2px solid var(--studio-accent-ring);
  outline-offset: 1px;
}

.panel :deep(.seg__item.is-active) {
  background-color: var(--studio-surface);
  border-color: var(--studio-border-strong);
  box-shadow: var(--studio-shadow);
  color: var(--studio-accent-strong);
  font-weight: 600;
}

.panel :deep(.seg__item:disabled) {
  color: var(--studio-text-dim);
  background-color: transparent;
  opacity: 0.5;
  cursor: not-allowed;
}

/* 滑块 → 暖槽 + 朱砂圆点 */
.panel :deep(.slider__input) {
  height: 22px;
}

.panel :deep(.slider__input:focus-visible) {
  outline: 2px solid var(--studio-accent-ring);
  outline-offset: 2px;
  border-radius: var(--radius-full);
}

.panel :deep(.slider__input::-webkit-slider-runnable-track) {
  height: 4px;
  border-radius: var(--radius-full);
  background: var(--studio-border);
}

.panel :deep(.slider__input::-webkit-slider-thumb) {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  margin-top: -6px;
  border-radius: var(--radius-full);
  background-color: var(--studio-accent-strong);
  border: 2px solid var(--studio-surface);
  box-shadow: var(--studio-shadow);
  cursor: pointer;
}

.panel :deep(.slider__input:hover:not(:disabled)::-webkit-slider-thumb) {
  background-color: var(--studio-accent-strong);
}

.panel :deep(.slider__input:active:not(:disabled)::-webkit-slider-thumb) {
  transform: scale(1.06);
}

.panel :deep(.slider__input::-moz-range-track) {
  height: 4px;
  border-radius: var(--radius-full);
  background: var(--studio-border);
}

.panel :deep(.slider__input::-moz-range-thumb) {
  width: 16px;
  height: 16px;
  border-radius: var(--radius-full);
  background-color: var(--studio-accent-strong);
  border: 2px solid var(--studio-surface);
  box-shadow: var(--studio-shadow);
  cursor: pointer;
}

/* 输入框 / 下拉 → 白底圆角 + 朱砂聚焦环 */
.panel :deep(.pinput__control) {
  padding: 4px var(--space-2);
  border: 1px solid var(--studio-border);
  border-radius: var(--studio-radius-sm);
  background-color: var(--studio-surface);
  color: var(--studio-text);
  font-size: var(--text-xs);
  line-height: var(--text-xs-lh);
  transition: var(--transition-interactive);
}

.panel :deep(.pinput__control::placeholder) {
  color: var(--studio-text-dim);
}

.panel :deep(.pinput__control:hover:not(:disabled)) {
  border-color: var(--studio-border-strong);
}

.panel :deep(.pinput__control:focus) {
  border-color: var(--studio-accent-ring);
  box-shadow: 0 0 0 2px var(--studio-accent-soft);
  outline: none;
}

.panel :deep(.pinput__control:disabled) {
  background-color: var(--studio-surface-2);
  color: var(--studio-text-dim);
  cursor: not-allowed;
}

.panel :deep(.pselect__control) {
  padding: 4px 30px 4px var(--space-2);
  border: 1px solid var(--studio-border);
  border-radius: var(--studio-radius-sm);
  background-color: var(--studio-surface);
  color: var(--studio-text);
  font-size: var(--text-xs);
  line-height: var(--text-xs-lh);
  transition: var(--transition-interactive);
}

.panel :deep(.pselect__control:hover:not(:disabled)) {
  border-color: var(--studio-border-strong);
}

.panel :deep(.pselect__control:focus) {
  border-color: var(--studio-accent-ring);
  box-shadow: 0 0 0 2px var(--studio-accent-soft);
  outline: none;
}

.panel :deep(.pselect__control:disabled) {
  background-color: var(--studio-surface-2);
  color: var(--studio-text-dim);
  cursor: not-allowed;
}

.panel :deep(.pselect__chevron) {
  color: var(--studio-text-dim);
}

/* 开关 → 朱砂胶囊 */
.panel :deep(.ptoggle__track) {
  border-radius: var(--radius-full);
  background-color: var(--studio-border);
  border: 1px solid var(--studio-border-strong);
  transition: var(--transition-interactive);
}

.panel :deep(.ptoggle__thumb) {
  border-radius: var(--radius-full);
  background-color: var(--studio-surface);
  box-shadow: var(--studio-shadow);
}

.panel :deep(.ptoggle__input:checked ~ .ptoggle__track) {
  background-color: var(--studio-accent-strong);
  border-color: var(--studio-accent-strong);
}

.panel :deep(.ptoggle__control:focus-within .ptoggle__track) {
  outline: 2px solid var(--studio-accent-ring);
  outline-offset: 2px;
}

/* 按钮 → 印坊纸感按钮（覆盖全部变体） */
.panel :deep(.paper-btn) {
  border-radius: var(--studio-radius-sm);
  border: 1px solid var(--studio-border);
  background-color: var(--studio-surface);
  color: var(--studio-text);
  font-weight: 500;
  padding: 6px var(--space-3);
  transition: var(--transition-interactive);
}

.panel :deep(.paper-btn:hover:not(:disabled)) {
  background-color: var(--studio-surface-2);
  border-color: var(--studio-border-strong);
}

.panel :deep(.paper-btn:active:not(:disabled)) {
  background-color: var(--studio-surface-2);
  transform: none;
}

.panel :deep(.paper-btn:focus-visible) {
  outline: none;
  border-color: var(--studio-accent-ring);
  box-shadow: 0 0 0 2px var(--studio-accent-soft);
}

.panel :deep(.paper-btn:disabled) {
  opacity: 0.5;
  color: var(--studio-text-dim);
  background-color: var(--studio-surface);
  cursor: not-allowed;
}

.panel :deep(.paper-btn.v-primary) {
  background-color: var(--studio-accent-strong);
  border-color: var(--studio-accent-strong);
  color: #ffffff;
}

.panel :deep(.paper-btn.v-primary:hover:not(:disabled)) {
  background-color: var(--accent-600);
  border-color: var(--accent-600);
}

.panel :deep(.paper-btn.v-secondary) {
  background-color: var(--studio-surface);
  border-color: var(--studio-accent-ring);
  color: var(--studio-accent-strong);
}

.panel :deep(.paper-btn.v-secondary:hover:not(:disabled)) {
  background-color: var(--studio-accent-soft);
  border-color: var(--studio-accent-strong);
}

.panel :deep(.paper-btn.v-outline) {
  background-color: transparent;
  border-color: var(--studio-border);
  color: var(--studio-text);
}

.panel :deep(.paper-btn.v-outline:hover:not(:disabled)) {
  background-color: var(--studio-surface-2);
  border-color: var(--studio-border-strong);
}

.panel :deep(.paper-btn.v-ghost) {
  background-color: transparent;
  border-color: transparent;
  color: var(--studio-text);
}

.panel :deep(.paper-btn.v-ghost:hover:not(:disabled)) {
  background-color: var(--studio-surface-2);
}

.panel :deep(.paper-btn.v-dark) {
  background-color: var(--gray-900);
  border-color: var(--gray-900);
  color: #ffffff;
}

/* 预设按钮（PresetCard 自定义控件） */
.panel :deep(.preset) {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--studio-border);
  border-radius: var(--studio-radius);
  background-color: var(--studio-surface);
  text-align: left;
  transition: var(--transition-interactive);
}

.panel :deep(.preset:hover) {
  background-color: var(--studio-surface-2);
  border-color: var(--studio-border-strong);
}

.panel :deep(.preset:focus-visible) {
  outline: none;
  border-color: var(--studio-accent-ring);
  box-shadow: 0 0 0 2px var(--studio-accent-soft);
}

.panel :deep(.preset:active) {
  background-color: var(--studio-surface-2);
  transform: none;
}

.panel :deep(.preset__label) {
  font-size: var(--text-xs);
  line-height: var(--text-xs-lh);
  font-weight: 600;
  color: var(--studio-text);
}

.panel :deep(.preset__desc) {
  font-size: 12px;
  line-height: 16px;
  color: var(--studio-text-dim);
}

/* 印色色板（ColorCard 自定义控件） */
.panel :deep(.swatch) {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-2) var(--space-1);
  border: 1px solid var(--studio-border);
  border-radius: var(--studio-radius);
  background-color: var(--studio-surface);
  transition: var(--transition-interactive);
}

.panel :deep(.swatch:hover) {
  background-color: var(--studio-surface-2);
  border-color: var(--studio-border-strong);
}

.panel :deep(.swatch:focus-visible) {
  outline: none;
  border-color: var(--studio-accent-ring);
  box-shadow: 0 0 0 2px var(--studio-accent-soft);
}

.panel :deep(.swatch.is-active) {
  border-color: var(--studio-accent-strong);
  box-shadow: 0 0 0 2px var(--studio-accent-soft);
  background-color: var(--studio-surface-2);
}

.panel :deep(.swatch__chip) {
  width: 22px;
  height: 22px;
  border-radius: var(--studio-radius-sm);
  border: 1px solid var(--studio-border-strong);
}

.panel :deep(.swatch__name) {
  font-size: 12px;
  line-height: 16px;
  color: var(--studio-text-dim);
  white-space: nowrap;
}
</style>
