<template>
  <div>
    <HeaderComponent 
      title="#4 Intersections"
      subtitle="4 lines fading in the center"
      :sourceCode="`https://github.com/lorismat/genuary2023/blob/main/components/Canvas/Canvas${Number($route.name)}.vue`"
    />

    <Entries
      generate="true"
      :prev="`/${Number($route.name) - 1}`"
      :next="(Number($route.name) < day) ? `/${Number($route.name) + 1}` : undefined"
    />
    
    <client-only>
      <CanvasCanvas4
        record="png"
      />
    </client-only>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "light",
});

const day = useState('day');
</script>