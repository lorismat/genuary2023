<template>
  <footer>
    <div><NuxtLink to="/">Home</NuxtLink></div>
    <div><a href="https://www.lorismat.com/" target="_blank">Loris Mat</a></div>
  </footer>
</template>

<style lang="scss" scoped>
footer {
  bottom:0;
  left:0;
  position:fixed;
  display:flex;
  justify-content: right;
  width:100%;

  div {
    padding-right: 15px;
    padding-bottom: 20px;
  }
}
</style>