<template>
  <div>
    <HeaderComponent 
      title="#8 Signed Distance Functions"
      subtitle=""
      :sourceCode="`https://github.com/lorismat/genuary2023/blob/main/components/Canvas/Canvas${Number($route.name)}.vue`"
    />

    <Entries
      :prev="`/${Number($route.name) - 1}`"
      :next="(Number($route.name) < day) ? `/${Number($route.name) + 1}` : undefined"
    />
    
    <client-only>
      <CanvasCanvas8
        record="png"
      />
    </client-only>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "dark",
});

const day = useState('day');
</script>