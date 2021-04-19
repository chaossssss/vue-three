<template>
  <div id="container">
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
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
import { CopyShader } from "three/examples/jsm/shaders/CopyShader.js";
import JIAXING from "../utils/JIAXING.json";
var scene, camera, renderer, composer, renderPass,cube,outlinePass;
var arrowTexture
export default {
  name: "Shape",
  data() {
    return {
      projection: "",
      group: "",
      map: "",
      raycaster: "",
      mouse: "",
      eventOffset: {},
      activeInstersect: [],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.setScene();
      this.setCamera();
      this.setLight();
      this.setRenderer();
      this.addCube()

      this.setComposer();
      this.setRendererPass();

      this.outline()
      this.addPlane();
      this.render();
    },
    setScene() {
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
    setLight() {
      // 环境光
      const light = new THREE.AmbientLight(0x404040);
      scene.add(light);

      // 点光源
      const pointLight = new THREE.PointLight(0xffffff, 1, 10000);
      pointLight.position.set(50, 50, 50);
      pointLight.castShadow = true;
      const pointLightHelper = new THREE.PointLightHelper(pointLight, 8);
      scene.add(pointLight);
      scene.add(pointLightHelper);
    },
    setRenderer() {
      let container = document.getElementById("container");
      renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(renderer.domElement);
    },
    setComposer() {
      composer = new EffectComposer(renderer);
    },
    setRendererPass() {
      renderPass = new RenderPass(scene, camera);
      // let effectCopy = new ShaderPass(CopyShader);//CopyShader是为了能将结果输出，普通的通道一般都是不能输出的，要靠CopyShader进行输出
      // effectCopy.renderToScreen = true;//设置这个参数的目的是马上将当前的内容输出
      // let bloomPass = new BloomPass(3, 15, 1.0, 256);
      composer.addPass(renderPass);
      // composer.addPass(bloomPass)
      // composer.addPass(effectCopy)
    },
    addPlane() {
      const geometry = new THREE.PlaneGeometry(40, 40);
      const material = new THREE.MeshBasicMaterial({
        color: 0xcccccc,
        side: THREE.DoubleSide,
      });
      const plane = new THREE.Mesh(geometry, material);
      plane.receiveShadow = true; // 设置平面网格为接受阴影的投影面
      plane.rotation.x = -Math.PI / 2; //绕X轴旋转90度
      scene.add(plane);
    },
    addCube() {
      const geometry = new THREE.BoxGeometry(6,6,6);



      const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
      cube = new THREE.Mesh(geometry, material);
      cube.position.set(0,3,0)
      scene.add(cube);
    },
    outline(){

      // var renderPass = RenderPass( scene, camera );
      // composer.addPass( renderPass ); // 特效渲染

      outlinePass = new OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), scene, camera );
      composer.addPass( outlinePass ); // 加入高光特效

      outlinePass.pulsePeriod = 2; //数值越大，律动越慢
      outlinePass.visibleEdgeColor.set( 0xff0000 ); // 高光颜色
      outlinePass.hiddenEdgeColor.set( 0x000000 );// 阴影颜色
      outlinePass.usePatternTexture = false; // 使用纹理覆盖？
      outlinePass.edgeStrength = 5; // 高光边缘强度
      outlinePass.edgeGlow = 1; // 边缘微光强度
      outlinePass.edgeThickness = 1; // 高光厚度

      
      outlinePass.selectedObjects = [cube]; // 需要高光的obj 数组！！！！！！！！！！！！！！！！
      console.log(outlinePass,cube)
    },
    render() {
      let clock = new THREE.Clock();
      let delta = clock.getDelta();
      requestAnimationFrame(this.render);
      // arrowTexture.offset.y -= 0.06


      composer.render(delta); //使用组合器来渲染，而不再用webGLRenderer
      // renderer.render(scene, camera);
    },
  },
};

/* eslint-disable */
</script>
<style scoped lang="less">
#container {
  position: relative;
  width: 100vw;
  height: 100vh;
}
#provinceInfo {
  position: absolute;
  z-index: 2;
  background: white;
  padding: 10px;
  // visibility: hidden;
}
</style>
