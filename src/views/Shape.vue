<template>
  <div id="container">

  </div>
</template>

<script>
/* eslint-disable */

import * as THREE from 'three'
import JIAXING from '../utils/JIAXING.json'
var scene,camera,renderer
export default {
  name: 'Shape',
  mounted(){
    this.init()
  },
  methods: {
    init(){
      this.setScene()
      this.setCamera()
      this.setRenderer()
      // this.addCube()
      this.addPlane()
      this.addShape()
      this.setLight()
      this.render()
    },
    setScene(){
      scene = new THREE.Scene()
    },
    setCamera(){
      camera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 1, 10000);
      camera.position.set(100,100,40);
      camera.lookAt(0, 0, 0);
    },
    setLight(){
      // 环境光
      const light = new THREE.AmbientLight( 0x404040 );
      scene.add( light );

      // 点光源
      const pointLight = new THREE.PointLight(0xffffff, 1, 10000);
      pointLight.position.set(50, 50, 50);
      pointLight.castShadow = true;
      const pointLightHelper = new THREE.PointLightHelper(pointLight, 8);
      scene.add(pointLight);
      scene.add(pointLightHelper);
    },
    setRenderer(){
      let container = document.getElementById("container")
      renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(renderer.domElement);
    },
    addPlane(){
      const geometry = new THREE.PlaneGeometry( 40, 40 );
      const material = new THREE.MeshBasicMaterial( {color: 0xcccccc, side: THREE.DoubleSide} );
      const plane = new THREE.Mesh( geometry, material );
      plane.receiveShadow = true; // 设置平面网格为接受阴影的投影面
      plane.rotation.x = -Math.PI / 2; //绕X轴旋转90度
      scene.add( plane );
    },
    addCube(){
      const geometry = new THREE.BoxGeometry();
			const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
			const cube = new THREE.Mesh( geometry, material );
			scene.add( cube );
    },
    addShape(){
      const x = 0, y = 0;
      const heartShape = new THREE.Shape();
      heartShape.moveTo( x + 5, y + 5 );
      heartShape.bezierCurveTo( x + 5, y + 5, x + 4, y, x, y );
      heartShape.bezierCurveTo( x - 6, y, x - 6, y + 7,x - 6, y + 7 );
      heartShape.bezierCurveTo( x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19 );
      heartShape.bezierCurveTo( x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7 );
      heartShape.bezierCurveTo( x + 16, y + 7, x + 16, y, x + 10, y );
      heartShape.bezierCurveTo( x + 7, y, x + 5, y + 5, x + 5, y + 5 );
      const geometry = new THREE.ShapeGeometry( heartShape );
      const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
      const mesh = new THREE.Mesh( geometry, material ) ;
      mesh.rotation.x = -Math.PI / 2; //绕X轴旋转90度
      scene.add( mesh );
    },
    render(){
      requestAnimationFrame(this.render)
      renderer.render(scene, camera)
    }
  }
}

/* eslint-disable */
</script>
<style scoped lang="less">
#container {
  width: 100vw;
  height: 100vh;
}
</style>
