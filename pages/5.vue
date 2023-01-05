<template>
  <div>
    <HeaderComponent 
      title="#5 Debug view"
      subtitle="Untitled"
      :sourceCode="`https://github.com/lorismat/genuary2023/blob/main/components/Canvas/Canvas${Number($route.name)}.vue`"
    />

    <Entries
      :prev="`/${Number($route.name) - 1}`"
      :next="(Number($route.name) < day) ? `/${Number($route.name) + 1}` : undefined"
    />
    
    <client-only>
      <CanvasCanvas5
        small="500"
        record="webm"
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