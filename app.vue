<template>
  <div>
    <!-- Markup shared across all pages, ex: NavBar -->
    <NuxtPage />
    <TheFooter />
  </div>
</template>


<style lang="scss">
@font-face {
  font-family: "Oxygen";
  src: url(@/assets/fonts/Oxygen/Oxygen-Regular.ttf) format("truetype");
  font-weight: 400;
  font-style: normal;
}
@font-face {
  font-family: "Oxygen";
  src: url(@/assets/fonts/Oxygen/Oxygen-Bold.ttf) format("truetype");
  font-weight: 700;
  font-style: normal;
}
@font-face {
  font-family: "Oxygen";
  src: url(@/assets/fonts/Oxygen/Oxygen-Light.ttf) format("truetype");
  font-weight: 300;
  font-style: normal;
}

html {
  font-family: "Oxygen";
}

body {
  background-color: $black;
  color: $white;
  font-size: 16px;
  font-weight: 300;
  padding:0 2px;
}

a {
  color: $white;
  text-decoration: none;
}

a:hover {
  border-bottom: 1px solid;
}

button {
  cursor:pointer;
}

.primary {
  color: $primary;
}

.secondary {
  color:$secondary;
}

.border-b {
  border-bottom: 1px solid $primary;
}

.text-left {
  text-align: left;
}
</style>