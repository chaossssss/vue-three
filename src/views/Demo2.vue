<template>
  <div class="hello">
    <div id="container"></div>
  </div>
</template>

<script>
import * as THREE from "three";
const OrbitControls = require("three-orbit-controls")(THREE);
// 辅助工具
import * as dat from 'dat.gui'
import * as Stats from 'stats.js'
var stats = new Stats()
var scene,camera,renderer
export default {
  name: "Demo2",
  data() {
    return {

    };
  },
  mounted() {
    this.init()
    this.animate()
    this.dat()
  },
  methods: {
    init() {
      // 创建场景
      scene = new THREE.Scene();
      let container = document.getElementById("container")

      // 状态栏
      stats.showPanel(0)
      container.appendChild(stats.dom)

      // 创建相机
      camera = new THREE.PerspectiveCamera( // 透视投影相机
        40, // 视场，表示能够看到的角度范围
        window.innerWidth / window.innerHeight, // 渲染窗口的长宽比，设置为浏览器窗口的长宽比
        0.1, // 从距离相机多远的位置开始渲染
        2000 // 距离相机多远的位置截止渲染
      );
      camera.position.set(-10, 10, 40); // 设置相机位置


      // 点光源
      const pointLight = new THREE.PointLight(0xffffff, 1, 10000)
      pointLight.position.set(15,60,16)
      pointLight.castShadow = true
      const pointLightHelper = new THREE.PointLightHelper(pointLight,8)
      scene.add(pointLight)
      scene.add(pointLightHelper)

      // 创建渲染器
      renderer = new THREE.WebGLRenderer({
        antialias: true, // 是否执行抗锯齿
      });
      renderer.setPixelRatio(window.devicePixelRatio); // 设置设备像素比率。通常用于HiDPI设备，以防止输出画布模糊。
      renderer.setSize(window.innerWidth, window.innerHeight); // 设置渲染器大小
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
      container.appendChild(renderer.domElement);

      // 创建控制器
      new OrbitControls(camera, renderer.domElement);

      // 创建物体
      const geometry = new THREE.BoxBufferGeometry(4, 4, 4); // 生成几何体
      const material = new THREE.MeshStandardMaterial({
        // 生成材质
        color: 0x00ff00,
      });
      const mesh = new THREE.Mesh(geometry, material); // 生成网格
      mesh.castShadow = true; // 对象是否渲染到阴影贴图中，默认值为false
      // mesh.receiveShadow = false
      mesh.position.set(0, 2, 0); // 设置物体位置
      scene.add(mesh); // 添加到场景中

      // 球
      const sphereGeometry = new THREE.SphereGeometry(2,20,20)
      const sphereMaterial = new THREE.MeshStandardMaterial({color:0x7777ff})
      const sphere = new THREE.Mesh(sphereGeometry,sphereMaterial)
      sphere.castShadow = true
      sphere.position.set(-10,2,-8)
      scene.add(sphere)

      // 创建平面
      const planeGeometry = new THREE.PlaneGeometry(300, 300); // 生成平面几何
      const planeMaterial = new THREE.MeshLambertMaterial({
        // 生成材质
        color: 0xcccccc,
      });
      const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial); // 生成平面网格
      planeMesh.receiveShadow = true; // 设置平面网格为接受阴影的投影面
      planeMesh.rotation.x = -Math.PI / 2; //绕X轴旋转90度
      scene.add(planeMesh); // 添加到场景中

      // 平面
      const gridHelper = new THREE.GridHelper(300,300)
      scene.add(gridHelper)

      // 环境光
      scene.add(new THREE.AmbientLight(0xffffff))

      // 辅助线
      const axex2 = new THREE.AxisHelper(20)
      scene.add(axex2)

      // 组
      const group1 = new THREE.Group()
      group1.add(mesh)
      group1.add(sphere)
      scene.add(group1)

      // 创建平行光源
      // const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // 平行光，颜色为白色，强度为1
      // directionalLight.position.set(-40, 40, 20); // 设置灯源位置
      // directionalLight.castShadow = mesh; // 允许生成阴影
      // directionalLight.shadow.mapSize.width = 9048; // default
      // directionalLight.shadow.mapSize.height = 9048; // default
      // directionalLight.shadow.camera.near = 0.5; // default
      // directionalLight.shadow.camera.far = 500; // default
      // directionalLight.target = group1;
      // const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight,5)
      // scene.add(directionalLight); // 添加到场景中
      // scene.add(directionalLightHelper)

      // 光源
      // const ambientLight = new THREE.AmbientLight(0xffffff)
      // scene.add(ambientLight)

      const cameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
      scene.add(cameraHelper)


    },
    animate(){
      requestAnimationFrame(this.animate)
      stats.update()
      renderer.render(scene,camera)
    },
    dat(){
      let controls = new function() {
        this.rotationSpeed = 0.02
      }
      var gui = new dat.GUI()
      gui.add(controls,'rotationSpeed',0,0.5)
    },
  },
};
</script>
<style scoped lang="less">
</style>
