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
var scene,camera,renderer,bloomComposer
export default {
  name: "NewBloom",
  mounted() {
    this.init()
    this.setCube()
    this.setPass()
    this.render()
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
    setCube() {
      var geometry1 = new THREE.BoxGeometry(4, 4, 4);
      var material1 = new THREE.MeshBasicMaterial({
        color: 0x00ff00
      });
      var cube1 = new THREE.Mesh(geometry1, material1);
      // 重要代码，将当前创建的box分配到0层
      cube1.layers.set(0);
      cube1.position.set(10, 0, 0);
      scene.add(cube1);

      var geometry2 = new THREE.BoxGeometry(4, 4, 4);
      var material2 = new THREE.MeshBasicMaterial({
        color: 0xff0000
      });
      var cube2 = new THREE.Mesh(geometry2, material2);
      // 重要代码，将当前创建的box分配到1层
      cube2.layers.set(1);
      cube2.position.set(-10,0,0)
      scene.add(cube2);
    },
    setPass() {
      // RenderPass这个通道会渲染场景，但不会将渲染结果输出到屏幕上
      const renderScene = new RenderPass(scene, camera);

      const effectCopy = new ShaderPass(CopyShader); //传入了CopyShader着色器，用于拷贝渲染结果
      effectCopy.renderToScreen = true;
      // THREE.BloomPass(strength, kernelSize, sigma, Resolution)
      // strength 定义泛光效果的强度，值越高，明亮的区域越明亮，而且渗入较暗区域的也就越多
      // kernelSize 控制泛光的偏移量
      // sigma 控制泛光的锐利程度，值越高，泛光越模糊
      // Resolution 定义泛光的解析图，如果该值太低，结果的方块化就会越严重
      const bloomPass = new BloomPass(2, 25, 4.0, 256); //BloomPass通道效果

      //创建效果组合器对象，可以在该对象上添加后期处理通道，通过配置该对象，使它可以渲染我们的场景，并应用额外的后期处理步骤，在render循环中，使用EffectComposer渲染场景、应用通道，并输出结果。
      bloomComposer = new EffectComposer(renderer);
      bloomComposer.setSize(window.innerWidth, window.innerHeight);
      bloomComposer.addPass(renderScene);
      bloomComposer.addPass(bloomPass);
      bloomComposer.addPass(effectCopy);

      bloomComposer.render();
    },
    render() {
      renderer.autoClear = false
      // 渲染器清除颜色、深度或模板缓存. 此方法将颜色缓存初始化为当前颜色
      renderer.clear();
      camera.layers.set(1);
      bloomComposer.render();

      // 清除深度缓存
      renderer.clearDepth();
      camera.layers.set(0);
      renderer.render(scene, camera);
      requestAnimationFrame(this.render);
    },
    init2(){
      scene = new THREE.Scene()
      camera = new THREE.PerspectiveCamera(70,window.innerWidth / window.innerHeight, 1 , 10000)
      camera.position.set(50,50,50)
      camera.position.y = -50
      renderer = new THREE.WebGLRenderer({
        antialias: true
      })
    },
  },
};
/* eslint-disable */
</script>
<style scoped lang="less">
</style>
