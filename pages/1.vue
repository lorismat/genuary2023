<template>
  <div>
    <HeaderComponent 
      title="#1 Perfect loop / Infinite loop"
      subtitle="position.z = mapLinear(fract(increment), 0, 1, min, max)"
      :sourceCode="`https://github.com/lorismat/genuary2023/blob/main/components/Canvas/Canvas${Number($route.name)}.vue`"
    />
    <Entries
      :next="`/${Number($route.name) + 1}`"
    />
    <client-only>
      <CanvasCanvas1 
        small=550
        record="gif"
      />
    </client-only>
  </div>
</template>

<script>
definePageMeta({
  layout: "light",
});
</script>
