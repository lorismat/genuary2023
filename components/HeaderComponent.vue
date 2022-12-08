<template>
  <div>
    <h1>{{ title }}</h1>
    <h2>{{ subtitle }}</h2>
    <a :href="sourceCode" target="_blank">Source Code</a>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  subtitle: String,
  sourceCode: String,
})

</script>

<style lang="scss" scoped>
h1 {
  color: $primary;
}
</style>