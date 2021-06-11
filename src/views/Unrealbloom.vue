<template>
  <div class="con">
    <div id="container" class="container"></div>
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
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as Stats from "stats.js";
var scene, camera, renderer;
export default {
  name: "Unrealbloom",
  mounted() {
    this.setScene();
  },
  methods: {
    init() {},
    setScene() {
      const ENTIRE_SCENE = 0,
        BLOOM_SCENE = 1;
      // 设置不同层次
      const bloomLayer = new THREE.Layers();
      bloomLayer.set(BLOOM_SCENE);
      // 设置参数
      const params = {
        exposure: 1,
        bloomStrength: 5,
        bloomThreshold: 0,
        bloomRadius: 0,
        scene: "Scene with Glow",
      };

      const darkMaterial = new THREE.MeshBasicMaterial({ color: "black" });
      const materials = {};

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);

      // 色调映射？
      let container = document.getElementById("container");
      renderer.toneMapping = THREE.ReinhardToneMapping;
      container.appendChild(renderer.domElement);

      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(
        40,
        window.innerWidth / window.innerHeight,
        1,
        200
      );
      camera.position.set(0, 0, 20);
      camera.lookAt(0, 0, 0);
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.addEventListener("change", render);
      scene.add(new THREE.AmbientLight(0x404040));

      const renderScene = new RenderPass(scene, camera);

      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5,
        0.4,
        0.85
      );
      bloomPass.threshold = params.bloomThreshold;
      bloomPass.strength = params.bloomStrength;
      bloomPass.radius = params.bloomRadius;

      const bloomComposer = new EffectComposer(renderer);
      bloomComposer.renderToScreen = false;
      bloomComposer.addPass(renderScene);
      bloomComposer.addPass(bloomPass);

      let vertexShader = [
        "varying vec2 vUv;",
        "void main() {",
        "vUv = uv;",
        "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
        "}",
      ].join("\n");
      let fragmentShader = [
        "uniform sampler2D baseTexture;",
        "uniform sampler2D bloomTexture;",
        "varying vec2 vUv;",
        "void main() {",
        "gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );",
        "}",
      ].join("\n");

      const finalPass = new ShaderPass(
        new THREE.ShaderMaterial({
          uniforms: {
            baseTexture: { value: null },
            bloomTexture: { value: bloomComposer.renderTarget2.texture },
          },
          vertexShader: vertexShader,
          fragmentShader: fragmentShader,
          defines: {},
        }),
        "baseTexture"
      );
      finalPass.needsSwap = true;

      const finalComposer = new EffectComposer(renderer);
      finalComposer.addPass(renderScene);
      finalComposer.addPass(finalPass);

      // 创建平面
      const planeGeometry = new THREE.PlaneGeometry(300, 300); // 生成平面几何
      const planeMaterial = new THREE.MeshLambertMaterial({
        color: "#fff",
      });
      const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial); // 生成平面网格
      planeMesh.receiveShadow = true; // 设置平面网格为接受阴影的投影面
      planeMesh.rotation.x = -Math.PI / 2; //绕X轴旋转90度
      planeMesh.name = "plane";
      planeMesh.layers.set(8);
      scene.add(planeMesh); // 添加到场景中
      const gridHelper = new THREE.GridHelper(300, 300);
      scene.add(gridHelper);
      gridHelper.layers.set(1);

      camera.layers.set(1)
      bloomComposer.render();

      finalComposer.render();

      function render() {
					// scene.traverse(darkenNonBloomed);
					bloomComposer.render();
					// scene.traverse(restoreMaterial);

        finalComposer.render();
      }
    },
  },
};
/* eslint-disable */
</script>
<style scoped lang="less">
.con {
  width: 100vw;
  height: 100vh;
  position: relative;
}
#container {
  width: 100vw;
  height: 100vh;
}
</style>
