<template>
  <div>
    <slot />
  </div>
</template>

<style lang="scss">
body {
  background-color: $black;
  color: $white;
}

a {
  color: $white;
}

button {
  color: $white;
  border: 1px solid $white;
}

.source-link {
  border-bottom: 1px solid $white;
}

.primary, .secondary {
  color: $white;
}

.border-b {
  border-bottom: 1px solid $white;
}

</style>
