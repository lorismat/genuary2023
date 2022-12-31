<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
      <TheFooter />
    </NuxtLayout>
  </div>
</template>

<script setup>
import moment from 'moment';
const day = useState('day', () => moment().date());
</script>

<style lang="scss">

// shared style

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
  font-size: 16px;
  font-weight: 300;
  padding:0 2px;
}

a {
  text-decoration: none;
}

button {
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  margin: 10px 10px 0 0;
  display:flex;
  align-items: center;

  svg {
    padding: 4px;
  }
}

.btn-container {
  display:flex;
}

.text-left {
  text-align: left;
}

.text-right {
  text-align: right;
}

.hoverline:hover {
  border-bottom: 1px solid;
}

.hover-remove:hover {
  border-bottom: 0px solid;
}

.source-link {
  font-size:12px;
  font-weight: 300;
}

.italic {
  font-style: italic;
}

.mono {
  font-family: monospace;
}

.gray {
  color: $gray;
}

.py-2 {
  padding: 8px 0px;
}

// small canvas for mobile devices


</style>