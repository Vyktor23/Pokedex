<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  icon: { type: String, default: '' },
})
</script>

<template>
  <header class="page-header">
    <div v-if="icon" class="page-header__icon">
      <q-icon :name="icon" size="28px" />
    </div>
    <h1 class="page-title">{{ title }}</h1>
    <p v-if="subtitle" class="page-subtitle">{{ subtitle }}</p>
  </header>
</template>

<style scoped>
.page-header {
  text-align: center;
  margin-bottom: clamp(1rem, 4vw, 1.75rem);
}

.page-header__icon {
  width: 52px;
  height: 52px;
  margin: 0 auto 0.75rem;
  display: grid;
  place-items: center;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: #fff;
  box-shadow: 0 8px 20px rgba(227, 53, 13, 0.25);
}

.page-title {
  margin: 0 0 0.5rem;
  font-size: clamp(1.5rem, 5vw, 2rem);
  color: var(--color-text);
}

.page-subtitle {
  margin: 0 auto;
  max-width: 42ch;
  color: var(--color-text-muted);
  font-size: clamp(0.875rem, 2.5vw, 1rem);
}
</style>
