<template>
  <div>
    <div class="collection-header">
      Collections
    </div>

    <div class="collections-block">
      <div><a href="/collections/10x10/1">10x10</a></div>
      <div><a href="/collections/two-moons/1">Two Moons</a></div>
    </div>
    
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.collection-header {
  padding: 20px;
  font-size: 24px;
}

.collections-block {
  padding:30px;
  
  div {
    padding: 10px 0px;

    a {

      border-bottom: 2px solid $black;

    }
  }
}


</style>