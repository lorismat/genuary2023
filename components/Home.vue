<template>
  <div class="container"> 
    <div class="sub-container">
      <div class="svg-title text-left">
        <SVGTitle 
          width=""
          height=""
        />
      </div>
      <!-- 
        <div class="svg-line text-left">
        <SVGLine 
          width=""
          height=""
        />
      </div>
      -->
      
      <p>
        <a class="secondary hover-remove border-b" href="https://genuary.art/" target="_blank">Genuary</a> is a challenge where participants
        submit entries made with generative code every day of January. Each day matches with 
        <a class="secondary hover-remove border-b" href="https://genuary.art/prompts" target="_blank">a specific prompt</a>. <br>
        All my prompts are made with <span class="gray">Three.js</span> and/or <span class="gray">glsl</span> and are 
        <a class="secondary hover-remove border-b" href="https://github.com/lorismat/genuary2023" target="_blank">open-source</a>. 
      </p> 

      <div class="text-left primary py-2">
        @lorismat_
      </div>
      <div class="grid">
        <div  class="grid-item" v-for="p in projects">
          <a v-if="(p.id<=4)" :href="p.url">
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
import SVGLine from '@/assets/svg/line.svg';


const projects = Array(31).fill().map((_, i) => {
  return {
    id:i+1,
    url:`/${i+1}`,
    img:`/cover/${i+1}.jpg`,
    title:`#${i+1}`
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
  line-height: 1.6;
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
  overflow: visible;
}
.svg-title {
  max-width: 400px;
  margin: 20px 0 5px 0px;
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

.svg-line {
  //position: absolute;
  //top:10%;
  width:100%;
  margin:0;
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