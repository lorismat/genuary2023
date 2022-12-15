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
      <CanvasExtrasGrid
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