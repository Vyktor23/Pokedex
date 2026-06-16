<script setup>
defineProps({
  modelValue: { type: Boolean, required: true },
  variant: { type: String, default: 'success' },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  icon: { type: String, default: '' },
  primaryLabel: { type: String, default: 'Continuar' },
  secondaryLabel: { type: String, default: '' },
})

defineEmits(['update:modelValue', 'primary', 'secondary'])
</script>

<template>
  <q-dialog
    :model-value="modelValue"
    persistent
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <q-card class="feedback-card" :class="`feedback-card--${variant}`">
      <div class="feedback-card__glow" />
      <q-card-section class="feedback-card__body">
        <div class="feedback-card__icon-wrap">
          <q-icon
            :name="icon || (variant === 'success' ? 'auto_awesome' : variant === 'error' ? 'psychology_alt' : 'info')"
            size="40px"
          />
        </div>
        <h2 class="feedback-card__title">{{ title }}</h2>
        <p v-if="subtitle" class="feedback-card__subtitle">{{ subtitle }}</p>
        <slot />
      </q-card-section>
      <q-card-actions align="center" class="feedback-card__actions">
        <q-btn
          unelevated
          :color="variant === 'success' ? 'positive' : variant === 'error' ? 'primary' : 'secondary'"
          :label="primaryLabel"
          @click="$emit('primary')"
        />
        <q-btn
          v-if="secondaryLabel"
          flat
          :label="secondaryLabel"
          @click="$emit('secondary')"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped>
.feedback-card {
  position: relative;
  overflow: hidden;
  width: min(92vw, 400px);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
}

.feedback-card__glow {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 100px;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.35;
}

.feedback-card--success .feedback-card__glow { background: var(--color-success); }
.feedback-card--error .feedback-card__glow { background: var(--color-danger); }
.feedback-card--info .feedback-card__glow { background: var(--color-secondary); }

.feedback-card__body {
  position: relative;
  text-align: center;
  padding: 1.75rem 1.5rem 1rem;
}

.feedback-card__icon-wrap {
  width: 72px;
  height: 72px;
  margin: 0 auto 1rem;
  display: grid;
  place-items: center;
  border-radius: 20px;
  background: var(--color-bg);
}

.feedback-card--success .feedback-card__icon-wrap { color: var(--color-success); }
.feedback-card--error .feedback-card__icon-wrap { color: var(--color-danger); }
.feedback-card--info .feedback-card__icon-wrap { color: var(--color-secondary); }

.feedback-card__title {
  margin: 0 0 0.5rem;
  font-size: clamp(1.05rem, 4vw, 1.3rem);
  line-height: 1.3;
  color: var(--color-text);
}

.feedback-card__subtitle {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--color-text-muted);
}

.feedback-card__actions {
  padding: 0 1rem 1.25rem;
  gap: 0.5rem;
}
</style>
