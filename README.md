# Genuary 2023

[Live Website](https://lorismat-genuary2023.vercel.app/)  


[Genuary]() is a challenge where participants submit entries made with generative code every day of January. Each day matches with [a specific prompt]().
All my prompts are made with Three.js and/or glsl and are available in this repository.

## About the code

The website is a `Nuxt` application. All prompts are `vue` components using `Three.js` accessible in `components/Canvas/CanvasX.vue`.  
Some of the prompts run shaders, accessible in `assets/glsl/X`, `X` being the prompt day. 
