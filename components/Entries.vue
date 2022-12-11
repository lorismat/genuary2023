<template>
  <div>
    <div>
      <button id="randomize" v-if="props.generate != undefined">
        randomize
      </button>
    </div>
    <div>
      <button v-if="props.prev != undefined">
        <a :href="prev">prev</a>
      </button>
      <button v-if="props.next != undefined">
        <a :href="next">next</a>
      </button> 
    </div>
  </div>
</template>

<script setup lang="ts">

interface Props {
  prev?: string,
  next?: string,
  generate?: string
}

const props = defineProps<Props>();

</script>