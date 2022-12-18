<template>
  <div>
    <HeaderComponent 
      title="#2 Made in 10 minutes"
      subtitle="A shader from a line generator I built in the past."
      :sourceCode="`https://github.com/lorismat/genuary2023/blob/main/components/Canvas/Canvas${Number($route.name)}.vue`"
    />
    
    <Entries
      generate="true"
      :prev="`/${Number($route.name) - 1}`"
      :next="(Number($route.name) < day) ? `/${Number($route.name) + 1}` : undefined"
    />
    
    <client-only>
      <CanvasCanvas2 

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