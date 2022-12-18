<template>
  <div>
    <HeaderComponent 
      title=""
      subtitle=""
      sourceCode=""
    />

    <Entries
      generate="true"
    />
    
    <client-only>
      <CanvasExtrasPouring
        small="750"
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