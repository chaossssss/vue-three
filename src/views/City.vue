<template>
  <div class="con">
    <div id="container" class="container"></div>
    <div class="btn" @click="moveCamera">摄像头</div>
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
// import { TextureLoader } from "three/examples/jsm/loaders/TextureLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as Stats from "stats.js";
export default {
  name: "City",
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      light: null,
      controls: null,
      mesh: null,
      stats: null,
      container: null,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.setScene();
      this.addStats();
      this.addLightBar();
      this.loadGltf();
      this.animate();
    },
    setScene() {
      this.container = document.getElementById("container");
      this.camera = new THREE.PerspectiveCamera(
        40,
        this.container.clientWidth / this.container.clientHeight,
        0.01,
        10000
      );
      this.camera.lookAt({
        x: 0,
        y: 0,
        z: 0,
      });
      this.camera.position.set(10, 10, 10);
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xcccccc);
      this.scene.fog = new THREE.Fog(0xeeeeee, 0.01, 10000);
      // 辅助线
      this.scene.add(new THREE.AxesHelper(150));
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(
        this.container.clientWidth,
        this.container.clientHeight
      );
      this.container.appendChild(this.renderer.domElement);
      // 点光源
      const pointLight = new THREE.PointLight(0xffffff, 1, 10000);
      pointLight.position.set(6, 6, 0);
      pointLight.castShadow = true;
      const pointLightHelper = new THREE.PointLightHelper(pointLight, 8);
      this.scene.add(pointLight);
      this.scene.add(pointLightHelper);
      // 创建平面
      const planeGeometry = new THREE.PlaneGeometry(300, 300); // 生成平面几何
      const planeMaterial = new THREE.MeshLambertMaterial();
      const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial); // 生成平面网格
      planeMesh.receiveShadow = true; // 设置平面网格为接受阴影的投影面
      planeMesh.rotation.x = -Math.PI / 2; //绕X轴旋转90度
      planeMesh.name = "plane";
      this.scene.add(planeMesh); // 添加到场景中
      const gridHelper = new THREE.GridHelper(300, 300);
      this.scene.add(gridHelper);
      // 控制器
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    },
    // 状态栏
    addStats() {
      this.stats = new Stats();
      this.stats.showPanel(0);
      this.container.appendChild(this.stats.dom);
    },
    // 光柱
    addLightBar() {
      const geometry = new THREE.BoxGeometry(1, 2, 1);
      const TextureLoader = new THREE.TextureLoader().setPath("/texture/");
      const texture = TextureLoader.load("t1.png");
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 1,
      });
      let cube = new THREE.Mesh(geometry, [
        material,
        material,
        ,
        ,
        material,
        material,
      ]);
      cube.position.set(3.2, 4, 4.2);
      this.scene.add(cube);
    },
    // 加载
    loadGltf() {
      let _this = this;
      const GltfLoader = new GLTFLoader().setPath("/model/");
      GltfLoader.load("city.glb", function (gltf) {
        gltf.scene.scale.set(3, 3, 3);
        _this.scene.add(gltf.scene);
      });
    },
    // 摄像头
    moveCamera() {
      let _this = this
      //获取当前camera位置
      let camPosition = this.camera.position; //获取摄像机当前位置
      console.log("camPosition",camPosition)
      let newPosition = new THREE.Vertex(10, 10, 0); //设置目标位置
      let curve = addLines(camPosition, newPosition).curve; //绘制贝塞尔曲线
      //取curve的50个点
      let points = curve.getPoints(50);
      let index = 0;
      //摄像机每50毫秒移动一个点的位置
      let a = setInterval(function () {
        _this.camera.position.set(points[index].x, points[index].y, points[index].z);
        _this.camera.lookAt(new THREE.Vertex(0, 0, 0));
        index++;
        if (index > 50) {
          clearInterval(a);
        }
      }, 50);
      // 添加线条
      function addLines(v0, v3) {
        // 计算向量夹角
        let angle = (v0.angleTo(v3) * 30) / Math.PI / 10; // 0 ~ Math.PI
        let aLen = angle * 50,
          hLen = angle * angle * 120;
        let p0 = new THREE.Vector3(0, 0, 0);

        // 开始，结束点
        // let v0 = groupDots.children[0].position;
        // let v3 = groupDots.children[1].position;

        // 法线向量
        let rayLine = new THREE.Ray(p0, getVCenter(v0.clone(), v3.clone()));

        // 顶点坐标
        let vtop = rayLine.at(hLen / rayLine.at(1).distanceTo(p0));

        // 控制点坐标
        let v1 = getLenVcetor(v0.clone(), vtop, aLen);
        let v2 = getLenVcetor(v3.clone(), vtop, aLen);

        // 绘制贝塞尔曲线
        let curve = new THREE.CubicBezierCurve3(v0, v1, v2, v3);
        let geo = new THREE.Geometry();
        geo.vertices = curve.getPoints(50);
        let mat = new THREE.LineBasicMaterial({ color: 0xff0000 });

        return {
          curve: curve,
          lineMesh: new THREE.Line(geo, mat),
        };
      }

      // 计算v1,v2 的中点
      function getVCenter(v1, v2) {
        let v = v1.add(v2);
        return v.divideScalar(2);
      }

      // 计算V1，V2向量固定长度的点
      function getLenVcetor(v1, v2, len) {
        let v1v2Len = v1.distanceTo(v2);
        return v1.lerp(v2, len / v1v2Len);
      }
    },
    animate() {
      requestAnimationFrame(this.animate);
      this.stats.update();
      this.renderer.render(this.scene, this.camera);
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
.btn {
  position: absolute;
  right: 20px;
  top: 20px;
  background: rgb(255, 0, 0);
  color: #fff;
  z-index: 50;
}
</style>
