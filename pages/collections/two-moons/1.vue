<template>
  <div>
    <HeaderComponent 
      title="Two Moons #1"
      :sourceCode="`https://github.com/lorismat/genuary2023/blob/main/components/Canvas/Canvas${Number($route.name)}.vue`"
    />
    <Entries
      generate="true"
      :next="`/collections/two-moons/${Number($route.matched[0].components.default.__name) + 1}`"
    />
    <client-only>
      <CollectionsTwoMoonsCanvas1 
        small=700
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
