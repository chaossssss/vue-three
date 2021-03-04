<template>
  <div class="three-con">
    <div id="container"></div>
  </div>
</template>
<script>

import * as Three from 'three'
 
export default {
  name: 'ThreeTest',
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      mesh: null
    }
  },
  methods: {
    init: function() {
			let container = document.getElementById('container');

			this.camera = new Three.PerspectiveCamera(70, container.clientWidth/container.clientHeight, 0.01, 10);
			this.camera.position.z = 1;

			this.scene = new Three.Scene();
      // console.log("this.scene",this.scene)
      var vFOV = Three.Math.degToRad(this.camera.fov); //将垂直fov转换为弧度
      var height = 2 * Math.tan(vFOV / 2)* 10; //可见高度
      var width = height * this.camera.aspect; //可见宽度
      console.log("height",height,",width",width)

			let geometry = new Three.BoxGeometry(0.2, 0.2, 0.2);
			let material = new Three.MeshNormalMaterial();

			this.mesh = new Three.Mesh(geometry, material);
			this.scene.add(this.mesh);

			this.renderer = new Three.WebGLRenderer({antialias: true});
			this.renderer.setSize(container.clientWidth, container.clientHeight);
			container.appendChild(this.renderer.domElement);
			console.log(this.mesh)
    },
    animate: function() {
				requestAnimationFrame(this.animate);

				// console.log(this.mesh.position.x)
				this.mesh.position.x += 0.01;
        // this.mesh.rotation.y += 0.02;
        this.renderer.render(this.scene, this.camera);
    }
  },
  mounted() {
      this.init();
      this.animate()
  }
}

</script>
<style scoped lang="less">
.three-con {
  width: 100vw;
  height: 100vh;
  #container {
    height: 400px;
  }
}
</style>
