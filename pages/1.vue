<template>
  <div>
    <HeaderComponent 
      title="01. Name"
      subtitle="Prompt: Perfect loop / Infinite loop / endless GIFs"
      :sourceCode="`https://github.com/lorismat/genuary2023/.../components/Canvas/Canvas${Number($route.name)}.vue`"
    />
    <Entries
      :next="`/${Number($route.name) + 1}`"
    />
    <client-only>
      <CanvasCanvas1 
        small="true"
        record="gif"
      />
    </client-only>
  </div>
</template>