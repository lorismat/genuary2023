<template>
  <div>
    <slot />
  </div>
</template>

<style lang="scss">
body {
  background-color: $white;
  color: $black;
}

a {
  color: $black;
}

button {
  color: $black;
  border: 1px solid $black;
}

.source-link {
  border-bottom: 1px solid $black;
}

.primary, .secondary {
  color: $black;
}

.border-b {
  border-bottom: 1px solid $black;
}
</style>
