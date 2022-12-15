<template>
  <div>
    <div>
      <button id="randomize" v-if="props.generate != undefined">
        randomize
      </button>
    </div>
    <div>
      <a v-if="props.prev != undefined" :href="prev">
        <button>
          prev
        </button>
      </a>
      <a v-if="props.next != undefined" :href="next">
        <button>
          next
        </button>
      </a>
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