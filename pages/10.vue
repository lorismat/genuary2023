<template>
  <div>
    <HeaderComponent 
      title="#10 Generative music"
      subtitle="Music: Sunder by Nicolas Jaar. Shape is distorted by some frequencies"
      :sourceCode="`https://github.com/lorismat/genuary2023/blob/main/components/Canvas/Canvas${Number($route.name)}.vue`"
    />

    <Entries
      :prev="`/${Number($route.name) - 1}`"
      :next="(Number($route.name) < day) ? `/${Number($route.name) + 1}` : undefined"
    />
    
    <client-only>
      <CanvasCanvas10
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