<template>
  <div>
    <button v-if="props.prev != undefined">
      <a :href="prev">prev</a>
    </button>
    <button v-if="props.next != undefined">
      <a :href="next">next</a>
    </button> 
  </div>
</template>

<script setup lang="ts">

interface Props {
  prev?: string,
  next?: string
}

const props = defineProps<Props>();

</script>