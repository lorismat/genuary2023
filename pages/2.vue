<template>
  <div>
    <HeaderComponent 
      title="02. Name"
      subtitle="Prompt: Made in 10 minutes"
      :sourceCode="`https://github.com/lorismat/genuary2023/.../components/Canvas/Canvas${Number($route.name)}.vue`"
    />
    <Entries
      :prev="`/${Number($route.name) - 1}`"
      :next="`/${Number($route.name) + 1}`"
    />
    <client-only>
      <CanvasCanvas2 
        small="false"
        record="png"
      />
    </client-only>
  </div>
</template>