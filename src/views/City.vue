<template>
  <div id="container" class="container"></div>
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
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
export default {
  name: 'City',
  data(){
    return {
      camera: null,
      scene: null,
      renderer: null,
      light: null,
      controls: null,
      mesh: null,
    }
  },
  mounted(){
    this.init()
  },
  methods: {
    init(){
      this.setScene()
      // this.loadObj()
      this.loadGltf()
      this.animate()
    },
    setScene(){
      let container = document.getElementById("container")
      this.camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.01, 10000)
      this.camera.lookAt({
        x: 0,
        y: 0,
        z: 0,
      })
      this.camera.position.set(80,80,80);
      this.scene = new THREE.Scene()
      this.scene.background = new THREE.Color(0xcccccc);
      this.scene.fog = new THREE.Fog(0xeeeeee,0.01,10000)
      // 辅助线
      this.scene.add(new THREE.AxesHelper(150))
      this.renderer = new THREE.WebGLRenderer({antialias: true})
      this.renderer.setSize(container.clientWidth, container.clientHeight)
      container.appendChild(this.renderer.domElement)
      // 点光源
      const pointLight = new THREE.PointLight(0xffffff, 1, 10000);
      pointLight.position.set(10, 10, 0);
      pointLight.castShadow = true;
      const pointLightHelper = new THREE.PointLightHelper(pointLight, 8);
      this.scene.add(pointLight);
      this.scene.add(pointLightHelper);
      // 立方体
      let geometry = new THREE.BoxGeometry(2, 2, 2)
      const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
      this.mesh = new THREE.Mesh(geometry, material)
      this.scene.add(this.mesh)
      // 控制器
      this.controls = new OrbitControls(this.camera,this.renderer.domElement)

    },
    loadGltf(){
      let _this = this
      const GltfLoader = new GLTFLoader().setPath('/model/')
      GltfLoader.load('city.glb',function(gltf){
        console.log("gltf",gltf)
        _this.scene.add(gltf.scene)
      })
    },
    animate(){
      requestAnimationFrame(this.animate)
      this.renderer.render(this.scene, this.camera)
    },
  }
}
/* eslint-disable */
</script>
<style scoped lang="less">
#container {
  width: 100vw;
  height: 100vh;
}
</style>
