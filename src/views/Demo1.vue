<template>
  <div class="hello">
    <div id="container"></div>
  </div>
</template>

<script>
import * as THREE from "three";
const OrbitControls = require("three-orbit-controls")(THREE);

export default {
  name: "Demo1",
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
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      this.camera.position.y = 13
      this.camera.position.z = 54

      this.renderer = new THREE.WebGLRenderer({antialias: true})
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.renderer.setSize(window.innerWidth,window.innerHeight)
      this.renderer.shadowMap.enabled = true
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
      this.renderer.gammaInput = true
      this.renderer.gammaOutput = true
      document.getElementById("container").appendChild(this.renderer.domElement)
      new OrbitControls(this.camera, this.renderer.domElement);
    
      // 光源
      const ambientLight = new THREE.AmbientLight(0xffffff)
      this.scene.add(ambientLight)
      const pointLight = new THREE.PointLight(0x0000ff,0,100)
      pointLight.castShadow = true
      pointLight.position.set(100,100,200)
      this.scene.add(pointLight)

      // 平面
      const planeGeometry = new THREE.PlaneGeometry(80,80)
      const planeMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide})
      const plane = new THREE.Mesh(planeGeometry,planeMaterial)
      plane.rotation.x = Math.PI / 2
      plane.receiveShadow = true

      // 网格
      const gridHelper = new THREE.GridHelper(80,80)

      // 辅助线
      const axex = new THREE.AxisHelper(20)
      const axex2 = new THREE.AxisHelper(20)
      this.scene.add(axex2)

      // 组
      const group1 = new THREE.Group()
      group1.add(plane)
      group1.add(axex)
      group1.add(gridHelper)
      group1.position.z = -14
      this.scene.add(group1)


      // 立方体
      const boxGeometry = new THREE.BoxGeometry(8,8,8)
      console.log(boxGeometry.center())
      const geometryMaterial = new THREE.MeshBasicMaterial({color: 0xffeecc})
      const cube = new THREE.Mesh(boxGeometry,geometryMaterial)
      cube.castShadow = true
      cube.position.set(0,4,0)
      this.scene.add(cube)
      this.camera.position.z = 10
    },
    animate(){
      requestAnimationFrame(this.animate)
      this.renderer.render(this.scene,this.camera)
    }
  },
};
</script>
<style scoped lang="less">
#container {
  width: 100vw;
  height: 100vh;
  background: #000;
}
</style>
