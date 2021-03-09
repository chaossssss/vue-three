<template>
  <div class="hello">
    <div id="container"></div>
  </div>
</template>

<script>
import * as THREE from "three";
const OrbitControls = require("three-orbit-controls")(THREE);
export default {
  name: "Demo2",
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
    };
  },
  mounted() {
    this.init()
    this.animate()
  },
  methods: {
    init() {
      // 创建场景
      this.scene = new THREE.Scene();
      let container = document.getElementById("container")
      // 创建相机
      this.camera = new THREE.PerspectiveCamera( // 透视投影相机
        40, // 视场，表示能够看到的角度范围
        window.innerWidth / window.innerHeight, // 渲染窗口的长宽比，设置为浏览器窗口的长宽比
        0.1, // 从距离相机多远的位置开始渲染
        2000 // 距离相机多远的位置截止渲染
      );
      this.camera.position.set(-10, 10, 40); // 设置相机位置

      // 创建渲染器
      this.renderer = new THREE.WebGLRenderer({
        antialias: true, // 是否执行抗锯齿
      });
      this.renderer.setPixelRatio(window.devicePixelRatio); // 设置设备像素比率。通常用于HiDPI设备，以防止输出画布模糊。
      this.renderer.setSize(window.innerWidth, window.innerHeight); // 设置渲染器大小
      this.renderer.shadowMap.enabled = true;
      container.appendChild(this.renderer.domElement);

      // 创建控制器
      new OrbitControls(this.camera, this.renderer.domElement);

      // 创建物体
      const geometry = new THREE.BoxBufferGeometry(4, 4, 4); // 生成几何体
      const material = new THREE.MeshLambertMaterial({
        // 生成材质
        color: 0x00ff00,
      });
      const mesh = new THREE.Mesh(geometry, material); // 生成网格
      mesh.castShadow = true; // 对象是否渲染到阴影贴图中，默认值为false
      mesh.position.set(0, 2, 0); // 设置物体位置
      this.scene.add(mesh); // 添加到场景中

      // 创建平面
      const planeGeometry = new THREE.PlaneGeometry(300, 300); // 生成平面几何
      const planeMaterial = new THREE.MeshLambertMaterial({
        // 生成材质
        color: 0xcccccc,
      });
      const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial); // 生成平面网格
      planeMesh.receiveShadow = true; // 设置平面网格为接受阴影的投影面
      planeMesh.rotation.x = -Math.PI / 2; //绕X轴旋转90度
      this.scene.add(planeMesh); // 添加到场景中

      // 平面
      const gridHelper = new THREE.GridHelper(80,80)
      this.scene.add(gridHelper)


      // 创建平行光源
      const light = new THREE.DirectionalLight(0xffffff, 1); // 平行光，颜色为白色，强度为1
      light.position.set(-40, 40, 20); // 设置灯源位置
      light.castShadow = true; // 允许生成阴影
      light.target = mesh;
      this.scene.add(light); // 添加到场景中
    },
    animate(){
      requestAnimationFrame(this.animate)
      this.renderer.render(this.scene,this.camera)
    }
  },
};
</script>
<style scoped lang="less">
</style>
