<template>
  <div class="hello"></div>
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

let scene, camera, renderer, composer;
const params = {
  exposure: 0,
  bloomStrength: 1.5,
  bloomThreshold: 0,
  bloomRadius: 0,
};
export default {
  name: "City3",
  data() {
    return {};
  },
  mounted() {
    this.init();
    this.initComposer();
    this.main();
    this.render();
  },
  methods: {
    init() {
      // 场景
      scene = new THREE.Scene();
      // 相机
      camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        1,
        100000
      );
      camera.position.set(50, 50, 50);
      camera.position.y = 50;
      // 渲染器
      renderer = new THREE.WebGLRenderer({
        antialias: true,
      });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(renderer.domElement);
      // 环境光
      const light = new THREE.AmbientLight(0xffffff, 0.6);
      light.layers.enable(0);
      light.layers.enable(1);
      scene.add(light);
      // 控制器
      const controls = new OrbitControls(camera, renderer.domElement);
      scene.add(new THREE.AxesHelper(100));
      window.onresize = () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
      };
    },
    // 创建后期效果
    initComposer() {
      composer = new EffectComposer(renderer);

      const renderScene = new RenderPass(scene, camera);
      // 光晕
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5,
        0.4,
        0.85
      );
      bloomPass.threshold = params.bloomThreshold;
      bloomPass.strength = params.bloomStrength;
      bloomPass.radius = params.bloomRadius;
      composer.addPass(renderScene);
      composer.addPass(bloomPass);
    },
    main() {
      const geometry = new THREE.BoxGeometry(20, 20, 10);
      // 正常方块
      const normalMtl = new THREE.MeshLambertMaterial({ color: 0x00ffff });
      const normalBox = new THREE.Mesh(geometry, normalMtl);
      normalBox.position.z = -5;
      normalBox.layers.set(0);
      scene.add(normalBox);

      // 发光方块
      const bloomMtl = new THREE.MeshLambertMaterial({ color: 0xff5500 });
      const bloomBox = new THREE.Mesh(geometry, bloomMtl);
      bloomBox.position.z = 5;
      bloomBox.layers.set(1);
      scene.add(bloomBox);
    },
    // 通过设置不同的层级显示不同的内容，渲染的话是整体渲染
    render() {
      renderer.autoClear = false;
      renderer.clear();
      camera.layers.set(1);
      composer.render();

      renderer.clearDepth(); // 清除深度缓存

      camera.layers.set(0);
      renderer.render(scene, camera);
      requestAnimationFrame(this.render);
    },
  },
};
/* eslint-disable */
</script>
<style scoped lang="less">
</style>
