<template>
  <div class="map-container" id="container">
    <canvas id="canvas"></canvas>
    <canvas id="name"></canvas>
  </div>
</template>

<script>
/* eslint-disable */
import * as THREE from "three";
import * as d3geo from "d3-geo";
import CHINA from "../utils/CHINA.json";
const OrbitControls = require("three-orbit-controls")(THREE);
var renderer, scene, camera, map, light;
export default {
  name: "Map",
  mounted() {
    this.initEnvironment()
    this.buildLightSystem()
    this.buildAuxSystem()
    this.initMap()
    this.loop()
  },
  methods: {
    initEnvironment(){
      scene = new THREE.Scene()
      scene.background = new THREE.Color(0xf0f0f0)
      map = new THREE.Object3D
      this.setCamera()
      renderer = new THREE.WebGLRenderer({
        alpah: true,
        canvas: document.querySelector('canvas')
      })
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(window.innerWidth,window.innerHeight)
      // document.addEventListener('mousemove',this.onDocumentMouseMove, false)
      // document.addEventListener('resize',this.onWindowResize, false)
    },
    initMap(){
      // 转化
      const projection = d3geo.geoMercator().center([104.0,37.5]).scale(80).translate([0,0])
      CHINA.features.forEach(elem => {
        const province = new THREE.Object3D()
        const coordinates = elem.geometry.coordinates
        coordinates.forEach(multiPolygon => {
          multiPolygon.forEach(polygon => {
            const shape = new THREE.Shape()
            const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff })
            const linGeometry = new THREE.Geometry()
            for( let i = 0; i < polygon.length; i++ ){
              const [x,y] = projection(polygon[i])
              if( i === 0){
                shape.moveTo(x, -y)
              }
              shape.lineTo(x, -y)
              lienGeometry.vertices.push(new THREE.Vector3(x,-y,4.01))
            }
            const extrudeSettings = {
              depth: 4,
              bevelEnabled: false
            }
            const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
            const material = new THREE.MeshBasicMaterial({ color: '#d13a34', transparent: true, opacity: 0.6 })
            const mesh = new THREE.Mesh(geometry, material)
            const line = new THREE.Line(linGeometry, lineMaterial)
            province.add(mesh)
            province.add(line)
          })
        })
        province.properties = elem.properties
        if(elem.properties.centroid){
          const [x,y] = projection(elem.properties.centroid)
          province.properties._centroid = [x,y]
        }
        map.add(province)
      })
      scene.add(map)
    },
    setCamera(){
      camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1 , 10000)
      camera.position.set(0,-70,90)
      camera.lookAt(0,0,0)
    },
    showName(){
      const width = window.innerWidth
      const height = window.innerHeight
      let canvas = document.querySelector("#name")
      if(!canvas) return
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')

      const offCanvas = document.createElement('canvas')
      offCanvas.width = width
      offCanvas.height = height
      const ctxOffCanvas = canvas.getContext('2d')
      ctxOffCanvas.font = '16.5px Arial'
      ctxOffCanvas.strokeStyle = '#ffffff'
      ctxOffCanvas.fillStyle = '#000000'

      const texts = []
      map.children.forEach((elem,index) => {
        if(!elem.properties._centroid) return
        const y = -elem.properties._centroid[1]
        const x = elem.properties._centroid[0]
        const z = 4
        const vector = new THREE.Vector3(x,y,z)
        const position = vector.project(camera)
        const name = elem.properties.name
        const left = (vector.x + 1) / 2 * width
        const top = -(vector.y - 1) / 2 * height
        const text = {
          name,
          left,
          top,
          width: ctxOffCanvas.measureText(name).width,
          height: 16.5
        }
        let show = true
        for(let i = 0; i < texts.length; i++){
          if(
            (text.left + text.width) < texts[i].left ||
            (text.top + text.height) < texts[i].top ||
            (texts[i].left + texts[i].width) < text.left ||
            (texts[i].top + texts[i].height) < text.top
          ){
            show = true
          }else{
            show = false
            break
          }
        }
        if(show){
          texts.push(text)
          ctxOffCanvas.strokeText(name, left, top)
          ctxOffCanvas.fillText(name, left, top)
        }
      })
      ctx.drawImage(offCanvas,0,0)
    },
    buildAuxSystem(){
      let axisHelper = new THREE.AxesHelper(2000)
      scene.add(axisHelper)
      let gridHelper = new THREE.GridHelper(600,60)
      scene.add(gridHelper)
      let controls = OrbitControls(camera,renderer.domElement)
      controls.enableDamping = true
      controls.dampingFactor = 0.25
      controls.rotateSpeed = 0.35
    },
    buildLightSystem(){
      let directionalLight = new THREE.DirectionalLight(0xffffff,1.1)
      directionalLight.position.set(300,1000,500)
      directionalLight.target.position.set(0,0,0)
      directionalLight.castShadow = true

      let d = 300
      const fov = 45
      const near = 1
      const far = 10000
      const aspect = window.innerWidth / window.innerHeight
      directionalLight.shadow.camera = new THREE.PerspectiveCamera(fov,aspect,near,far)
      directionalLight.shadow.bias = 0.0001
      directionalLight.shadow.mapSize.width = directionalLight.shadow.mapSize.height = 1024
      scene.add(directionalLight)
      light = new THREE.AmbientLight(0xffffff,0.6)
      scene.add(light)
    },
    onWindowResize(){
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth,window.innerHeight)
    },
    onDocumentMouseMove(event){
      event.preventDefault
    },
    loop(){
      this.showName()
      this.render()
      requestAnimationFrame(this.loop)
    },
    render(){
      renderer.render(scene,camera)
    }
  },
};
/* eslint-disable */
</script>
<style scoped lang="less">
.map-container {
  width: 100vw;
  height: 100vh;
}
</style>
