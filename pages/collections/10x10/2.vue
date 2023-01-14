<template>
  <div>
    <HeaderComponent 
      title="10x10 #2"
      :sourceCode="`https://github.com/lorismat/genuary2023/blob/main/components/Canvas/Canvas${Number($route.name)}.vue`"
    />


    <Entries
      generate="true"
      :prev="`/collections/10x10/${Number($route.matched[0].components.default.__name) - 1}`"
      :next="`/collections/10x10/${Number($route.matched[0].components.default.__name) + 1}`"
    />
    <client-only>
      <Collections10x10Canvas2 
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
