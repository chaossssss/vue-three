<template>
  <div class="hello">

  </div>
</template>

<script>
/* eslint-disable */
import * as THREE from "three";
import * as d3 from "d3-geo";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";
import { BloomPass } from "three/examples/jsm/postprocessing/BloomPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
import { CopyShader } from "three/examples/jsm/shaders/CopyShader.js";
const OrbitControls = require("three-orbit-controls")(THREE);
var scene, camera, renderer, composer, renderPass,bloomPass;
export default {
  name: 'HelloWorld',
  mounted(){

  },
  methods: {
    init(){
      this.setScene();
      this.setCamera();
    },
    setScene(){
      scene = new THREE.Scene();
    },
    setCamera() {
      camera = new THREE.PerspectiveCamera(
        10,
        window.innerWidth / window.innerHeight,
        1,
        10000
      );
      camera.position.set(100, 100, 40);
      camera.lookAt(0, 0, 0);
    },
  }
}
/* eslint-disable */
</script>
<style scoped lang="less">

</style>
