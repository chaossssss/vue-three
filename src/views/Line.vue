<template>
  <div class="hello">
    <div id="container" class="container"></div>
  </div>
</template>

<script>
/* eslint-disable */
// import * as YsThree from "../utils/ysThree"
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
const TWEEN = require("@tweenjs/tween.js");
const OrbitControls = require("three-orbit-controls")(THREE);
var scene,
  camera,
  renderer,
  composer,
  renderPass,
  bloomPass,
  container,
  clock,
  tubeAnimate,
  animate,
  line1;
export default {
  name: "Lines",
  mounted() {
    this.init();
    this.animate();
  },
  methods: {
    init() {
      this.setScene();
      this.setCamera();
      this.setLight();
      this.setRenderer();
      this.setLine();
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
      //add light
      const directionalLight = new THREE.DirectionalLight("#fff");
      directionalLight.position.set(30, 30, 30).normalize();
      scene.add(directionalLight);
      const ambientLight = new THREE.AmbientLight("#fff", 0.3); // obj 唯一 id
      scene.add(ambientLight);
    },
    setRenderer() {
      let _this = this;
      renderer = new THREE.WebGLRenderer();
      container = document.getElementById("container");
      renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(renderer.domElement);
      renderer.setClearColor("#d5d5d5", 1.0);
    },
    setLine() {
      // const pointsArr = [
      //   [-80, -20, -10],
      //   [-70, 20, -10],
      //   [0, 0, -10],
      //   [70, 30, -10],
      //   [20, 40, -10],
      // ];
      const pointsArr = [
        [-8, -2, 0],
        [-7, 2, 0],
        [0, 0, 0],
        [7, 3, 0],
        [2, 4, 0],
      ];
      const path = this.createPath(pointsArr);
      const geometry = new THREE.TubeGeometry(path, 100, 0.3);
      const textureLoader = new THREE.TextureLoader();
      const texture = textureLoader.load("/green_line.png");
      // const texture = textureLoader.load(img);
      // 设置阵列模式为 RepeatWrapping
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      // 设置x方向的偏移(沿着管道路径方向)，y方向默认1
      // 等价texture.repeat= new THREE.Vector2(3,1)
      texture.repeat.x = 3;

      // 模拟管线运动动画，将两个素材图按比例合并，然后生成贴图texture
      //const base64 = await mergeImage("./img/1.png", "./img/3.png", 6, 7);
      //const texture = createTexture(base64, { repeat: { x: 15 } });
      const material = new THREE.MeshPhongMaterial({
        map: texture,
        transparent: true,
        opacity: 0.8,
      });
      const mesh = new THREE.Mesh(geometry, material);
      // let { tubeTexture1, tube1 } = { texture, mesh };
      let tubeTexture1 = texture
      let tube1 = mesh
      tubeAnimate = function () {
        tubeTexture1.offset.x -= 0.02;
      };
      scene.add(tube1);
      this.animate();
    },
    createPath(pointsArr) {
      pointsArr = pointsArr.map((point) => new THREE.Vector3(...point));

      // 方法一：自定义三维路径
      /*
  const path = new THREE.CurvePath();
  for (let i = 0; i < pointsArr.length - 1; i++) {
    const lineCurve = new THREE.LineCurve3(pointsArr[i], pointsArr[i + 1]);
    path.curves.push(lineCurve);
  }
  */
      // 方法二：利用CatmullRomCurve3 创建三位路径，不过是平滑的三维样条曲线
      const path = new THREE.CatmullRomCurve3(pointsArr);

      return path;
    },
    animate() {
      clock = new THREE.Clock();
      tubeAnimate();
      TWEEN.update();
      renderer.render(scene, camera);
      requestAnimationFrame(this.animate);
    },
  },
};
/* eslint-disable */
</script>
<style scoped lang="less">
.container {
  width: 800px;
  height: 600px;
}
</style>
