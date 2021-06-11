<template>
  <div class="con">
    <div id="container" class="container"></div>
    <!-- <div class="btn" @click="moveCamera">摄像头</div> -->
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
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { CopyShader } from "three/examples/jsm/shaders/CopyShader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as Stats from "stats.js";

export default {
  name: "City2",
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      bloomComposer: null,
      container: "",
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.setScene();
      this.addStats();
      this.setCube();
      this.setPass();
      this.render();
    },
    setScene() {
      this.container = document.getElementById("container");
      // 场景
      this.scene = new THREE.Scene();
      // 相机
      this.camera = new THREE.PerspectiveCamera(
        75,
        this.container.clientWidth / this.container.clientHeight,
        0.01,
        1000000000
      );
      this.camera.position.set(50, 50, 50);
      this.camera.position.y = 50;
      this.camera.lookAt(0,0,0)
      // 渲染器
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
      });
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(
        this.container.clientWidth,
        this.container.clientHeight
      );
      this.container.appendChild(this.renderer.domElement);
      // 环境光
      const light = new THREE.AmbientLight(0xffffff, 0.6);
      light.layers.enable(1);
      light.layers.enable(2);
      this.scene.add(light);

      // 创建平面
      const planeGeometry = new THREE.PlaneGeometry(300, 300); // 生成平面几何
      const planeMaterial = new THREE.MeshBasicMaterial({
        color: "#ccc",
        side: THREE.DoubleSide,
        // depthTest:false,
        // depthWrite: false,
        transparent: true
      });
      const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial); // 生成平面网格
      // planeMesh.receiveShadow = true; // 设置平面网格为接受阴影的投影面
      planeMesh.rotation.x = -Math.PI / 2; //绕X轴旋转90度
      planeMesh.name = "plane";
      planeMesh.layers.set(1);
      this.scene.add(planeMesh); // 添加到场景中
      planeMesh.position.set(0,0,0)
      const gridHelper = new THREE.GridHelper(300, 300);
      // this.scene.add(gridHelper);
      gridHelper.layers.set(1)

      // 控制器
      const controls = new OrbitControls(this.camera, this.renderer.domElement);
      const AxesHelper = new THREE.AxesHelper(100)
      this.scene.add(AxesHelper);
      AxesHelper.layers.set(2)
      window.onresize = () => {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
      };
    },
    // 状态栏
    addStats() {
      this.stats = new Stats();
      this.stats.showPanel(0);
      this.container.appendChild(this.stats.dom);
    },
    setCube() {
      var geometry1 = new THREE.BoxGeometry(4, 4, 4);
      var material1 = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        depthTest:false,
        // depthWrite: true
      });
      var cube1 = new THREE.Mesh(geometry1, material1);
      // 重要代码，将当前创建的box分配到0层
      cube1.layers.set(1);
      cube1.position.set(10, 4, 0);
      this.scene.add(cube1);

      var geometry2 = new THREE.BoxGeometry(4, 4, 4);
      var material2 = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        depthTest:false
      });
      var cube2 = new THREE.Mesh(geometry2, material2);
      // 重要代码，将当前创建的box分配到1层
      cube2.layers.set(2);
      cube2.position.set(-10, 4, 0);
      this.scene.add(cube2);
    },
    setPass() {
      // RenderPass这个通道会渲染场景，但不会将渲染结果输出到屏幕上
      const renderScene = new RenderPass(this.scene, this.camera);

      const effectCopy = new ShaderPass(CopyShader); //传入了CopyShader着色器，用于拷贝渲染结果
      effectCopy.renderToScreen = true;
      // THREE.BloomPass(strength, kernelSize, sigma, Resolution)
      // strength 定义泛光效果的强度，值越高，明亮的区域越明亮，而且渗入较暗区域的也就越多
      // kernelSize 控制泛光的偏移量
      // sigma 控制泛光的锐利程度，值越高，泛光越模糊
      // Resolution 定义泛光的解析图，如果该值太低，结果的方块化就会越严重
      const bloomPass = new BloomPass(2, 25, 4.0, 256); //BloomPass通道效果

      //创建效果组合器对象，可以在该对象上添加后期处理通道，通过配置该对象，使它可以渲染我们的场景，并应用额外的后期处理步骤，在render循环中，使用EffectComposer渲染场景、应用通道，并输出结果。
      this.bloomComposer = new EffectComposer(this.renderer);
      this.bloomComposer.setSize(window.innerWidth, window.innerHeight);
      this.bloomComposer.addPass(renderScene);
      this.bloomComposer.addPass(bloomPass);
      this.bloomComposer.addPass(effectCopy);

      this.bloomComposer.render();
    },
    // 摄像头
    moveCamera() {
      let _this = this;
      //获取当前camera位置
      let camPosition = this.camera.position; //获取摄像机当前位置
      console.log("camPosition", camPosition);
      let newPosition = new THREE.Vertex(10, 10, 0); //设置目标位置
      let curve = addLines(camPosition, newPosition).curve; //绘制贝塞尔曲线
      //取curve的50个点
      let points = curve.getPoints(50);
      let index = 0;
      //摄像机每50毫秒移动一个点的位置
      let a = setInterval(function () {
        _this.camera.position.set(
          points[index].x,
          points[index].y,
          points[index].z
        );
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
    render() {
      this.stats.update();
      // 关键代码
      this.renderer.autoClear = false;
      // 渲染器清除颜色、深度或模板缓存. 此方法将颜色缓存初始化为当前颜色
      this.renderer.clear();
      this.camera.layers.set(2);
      this.bloomComposer.render();

      // 清除深度缓存
      this.renderer.clearDepth();
      this.camera.layers.set(1);
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(this.render);
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
