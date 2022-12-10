<template>
  <div class="container">
    <h1>{{ title }}</h1>
    <h2>{{ subtitle }}</h2>
    <a class="source-link" :href="sourceCode" target="_blank">Source Code</a>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  subtitle: String,
  sourceCode: String,
  theme: String
})

</script>

<style lang="scss" scoped>

h1 {
  font-size:16px;
  font-weight: 300;
  line-height: 1.5;
  letter-spacing: normal;
  padding: 0px;
  max-width: 300px;
  margin: 10px 0px;
}

h2 {
  font-size:12px;
  font-weight: 300;
  line-height: 1.5;
  letter-spacing: normal;
  padding: 0px;
  max-width: 300px;
  margin-bottom:10px;
}

</style>