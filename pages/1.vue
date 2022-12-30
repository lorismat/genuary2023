<template>
  <div>
    <HeaderComponent 
      title="#1 Perfect loop / Infinite loop"
      subtitle="30x30 cubes, looping infinitely"
      :sourceCode="`https://github.com/lorismat/genuary2023/blob/main/components/Canvas/Canvas${Number($route.name)}.vue`"
    />
    <Entries
      :next="(Number($route.name) < day) ? `/${Number($route.name) + 1}` : undefined"
    />
    <client-only>
      <CanvasCanvas1 
        small=600
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
