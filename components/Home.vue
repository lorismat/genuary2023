<template>
  <div class="container"> 
    <div class="sub-container">
      <div class="text-left">
        <SVGTitle 
          width=""
          height=""
        />
      </div>
      <p>
        <a class="secondary" href="https://genuary.art/" target="_blank">Genuary</a> is challenge where participants
        submit entries made with generative code every day of January. Each day matches with 
        <a class="secondary" href="https://genuary.art/prompts" target="_blank">a specific prompt</a>. 
        <br><br>
        <span class="primary border-b">Below are my submissions.</span>
      </p> 
      <div class="grid">
        <div class="grid-item" v-for="p in projects">
          <a :href="p.url">
            <img :src="p.img" :alt="p.url">
            <span class="pic-title">{{ p.title }}</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SVGTitle from '@/assets/svg/title.svg';

const projects = Array(31).fill().map((_, i) => {
  return {
    id:i+1,
    url:`/${i+1}`,
    img:`/cover/${i+1}.jpg`,
    title:`#${i+1}.23`
  }
})
</script>

<style lang="scss" scoped>
h1 {
  padding:8px 16px;
  margin: 20px auto;
  font-size: 2.5rem;
  text-align: center;
}

p {
  max-width: 600px;
  margin: 10px 0;
  padding:10px 0;
  text-align: left;
}
.grid {
  display:grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  width: fit-content;
  place-content: start;
  place-items: start;
  column-gap: 4px;
  row-gap: 0px;
  margin: 0 auto;
}

img {
  max-width: 300px;
  max-height: 300px;
}

svg {
  max-width: 400px;
  margin: 20px 0;
}

.container {
  text-align: center;
}

.sub-container {
  width:fit-content;
  margin: 0 auto;
}

.grid-item {
  position:relative;
}
.pic-title {
  position:absolute;
  bottom:0;
  right:0;
  color: $black;
  padding: 10px;
  font-size: 1.2rem;
  font-family: monospace;
  letter-spacing: -1px;
}

@media screen and (max-width: 992px) {
  .grid {
    display:grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    width: fit-content;
    place-content: start;
    place-items: start;
    column-gap: 4px;
    row-gap: 0px;
  }
}

@media screen and (max-width: 600px) {
  .grid {
    display:grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    width: fit-content;
    place-content: start;
    place-items: start;
    column-gap: 4px;
    row-gap: 0px;
  }
}
</style>