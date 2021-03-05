<template>
  <div id="container"></div>
</template>
<script>
import * as THREE from "three";
import DragControls from "drag-controls";
DragControls.install({ THREE: THREE });
import { OBJLoader } from "three-obj-mtl-loader";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import {DDSLoader} from "three/examples/jsm/loaders/DDSLoader";
// import { CSS2DRenderer, CSS2DObject } from "three-css2drender";
// import { AmbientLight, LightShadow } from "three";
// const OrbitControls = require("three-orbit-controls")(THREE);
export default {
  name: "vue-three",
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      objects: [],
      OrbitControls: null
    };
  },
  methods: {
    // 初始化场景
    init() {
      let container = document.getElementById("container");
      /* 
        场景
      */
      this.scene = new THREE.Scene();
      /* 
        相机
      */
      this.camera = new THREE.PerspectiveCamera(
        30,
        container.clientWidth / container.clientHeight,
        1,
        1000
      );
      this.camera.position.z = 4;
      /* 
          渲染器
        */
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      this.renderer.setClearColor(0xb9d3ff, 1);
      container.appendChild(this.renderer.domElement);
      // 控制相机
      // this.OrbitControls = new OrbitControls(this.camera, this.renderer.domElement);
    },
    // 加载模型
    loadObj() {
      let _this = this;
      const loader = new OBJLoader();
      loader.load("/model/tree.obj", function (obj) {
        // let mesh = new THREE.Mesh()
        obj.position.set(0,-0.7,0);
        obj.name = 'tree'
        _this.scene.add(obj);
        console.log("obj",obj)
        // console.log("isMesh",obj.children[0].isMesh)
        _this.objects.push(obj.children[0])
      });
    },
    // 拖动方法
    drag() {
      // let transformControls = new THREE.transformControls(
      //   this.camera,
      //   this.renderer.domElement
      // );
      // this.scene.add(transformControls);
      // 过滤不是 Mesh 的物体,例如辅助网格对象
      // var objects = [];
      console.log("this.scene",this.scene)
      // this.calleArr(this.scene) //获取所有mesh
      console.log("this.objects",this.objects)
      // console.log("objects",objects)
      // 初始化拖拽控件
      let dragControls = new DragControls(this.objects, this.camera, this.renderer.domElement);
      dragControls.addEventListener("dragstart", function (event) {
        // this.OrbitControls.enabled = false
        console.log("dragstart",event)
      });

      dragControls.addEventListener("dragend", function (event) {
        // this.OrbitControls.enabled = false
        console.log("dragend",event)
      });
      // console.log(dragControls)

    },
    // 灯光效果
    light() {
      //添加聚光灯光源
      /*       let light = new THREE.SpotLight(0xffffff);
      light.position.set(-40, 60, -10);
      light.castShadow = true;
      light.shadow.mapSize.width = 2048;
      light.shadow.mapSize.height = 2048; */
      let light = new THREE.DirectionalLight(0xdfebff, 0.45); //从正上方（不是位置）照射过来的平行光，0.45的强度
      light.position.set(50, 200, 100);
      light.position.multiplyScalar(0.3);
      this.scene.add(light);
      //添加环境光
      let ambientLight = new THREE.AmbientLight("#ffdddd");
      this.scene.add(ambientLight);
    },
    // 动画效果
    animate() {
      requestAnimationFrame(this.animate);
      this.renderer.render(this.scene, this.camera);
    },
    calleArr(array){
      for(let i in array){
        let data = array[i]
        if(data.children){
          this.calleArr(data.children)
        }else{
          console.log("data",data)
          // if(data.isMesh){
          //   this.objects.push(data.children)
          // }
        }
      }
    }
  },
  mounted() {
    this.init();
    this.loadObj();
    this.light();
    this.animate();
    this.drag();
  },
};
</script>

<style scoped>
#container {
  width: 800px;
  margin: 0 auto;
  height: 500px;
  overflow: hidden;
}
</style>