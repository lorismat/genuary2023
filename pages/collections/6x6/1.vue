<template>
  <div>
    <HeaderComponent 
      title="6x6 #1"
      :sourceCode="`https://github.com/lorismat/genuary2023/blob/main/components/Canvas/Canvas${Number($route.name)}.vue`"
    />

    <Entries
      generate="true"
      :next="`/collections/6x6/${Number($route.matched[0].components.default.__name) + 1}`"
    />
    <client-only>
      <Collections6x6Canvas1 
        small=800
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
