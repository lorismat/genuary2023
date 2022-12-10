<template>
  <div>
    <HeaderComponent 
      title="#2 Made in 10 minutes"
      subtitle="A shader from a line generator I built in the past."
      :sourceCode="`https://github.com/lorismat/genuary2023/.../components/Canvas/Canvas${Number($route.name)}.vue`"
    />

    <!-- 
      <Entries
      :prev="`/${Number($route.name) - 1}`"
      :next="`/${Number($route.name) + 1}`"
    />
    -->
    
    <Entries
      :prev="`/${Number($route.name) - 1}`"
    />
    
    <client-only>
      <CanvasCanvas2 
        record="png"
      />
    </client-only>
  </div>
</template>

<script>
definePageMeta({
  layout: "dark",
});
</script>