<template>
  <div id="container">
    <div id="provinceInfo" ref="provinceInfo"></div>
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
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
import { CopyShader } from "three/examples/jsm/shaders/CopyShader.js";
import JIAXING from "../utils/JIAXING.json";
var scene, camera, renderer, composer, renderPass;
export default {
  name: "Shape",
  data() {
    return {
      projection: "",
      group: "",
      map: "",
      raycaster: "",
      mouse: "",
      eventOffset: {},
      activeInstersect: [],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.setScene();
      this.setCamera();
      this.setRenderer();

      this.setComposer();
      this.setRendererPass();

      // this.addCube()
      this.addPlane();
      // this.addShape()
      // this.addMap();
      this.initMap();
      this.setLight();
      this.setRaycaster()
      this.render();
    },
    setScene() {
      scene = new THREE.Scene();
    },
    setCamera() {
      camera = new THREE.PerspectiveCamera(
        10,
        window.innerWidth / window.innerHeight,
        1,
        10000
      );
      camera.position.set(100, 100, 40);
      camera.lookAt(0, 0, 0);
    },
    setLight() {
      // 环境光
      const light = new THREE.AmbientLight(0x404040);
      scene.add(light);

      // 点光源
      const pointLight = new THREE.PointLight(0xffffff, 1, 10000);
      pointLight.position.set(50, 50, 50);
      pointLight.castShadow = true;
      const pointLightHelper = new THREE.PointLightHelper(pointLight, 8);
      scene.add(pointLight);
      scene.add(pointLightHelper);
    },
    setRenderer() {
      let container = document.getElementById("container");
      renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(renderer.domElement);
    },
    setComposer() {
      composer = new EffectComposer(renderer);
    },
    setRendererPass() {
      renderPass = new RenderPass(scene, camera);
      // let effectCopy = new ShaderPass(CopyShader);//CopyShader是为了能将结果输出，普通的通道一般都是不能输出的，要靠CopyShader进行输出
      // effectCopy.renderToScreen = true;//设置这个参数的目的是马上将当前的内容输出
      // let bloomPass = new BloomPass(3, 15, 1.0, 256);
      composer.addPass(renderPass);
      // composer.addPass(bloomPass)
      // composer.addPass(effectCopy)
    },
    addPlane() {
      const geometry = new THREE.PlaneGeometry(40, 40);
      const material = new THREE.MeshBasicMaterial({
        color: 0xcccccc,
        side: THREE.DoubleSide,
      });
      const plane = new THREE.Mesh(geometry, material);
      plane.receiveShadow = true; // 设置平面网格为接受阴影的投影面
      plane.rotation.x = -Math.PI / 2; //绕X轴旋转90度
      scene.add(plane);
    },
    addCube() {
      const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);
    },
    addShape() {
      const x = 0,
        y = 0;
      const heartShape = new THREE.Shape();
      heartShape.moveTo(x + 5, y + 5);
      heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
      heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
      heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
      heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
      heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
      heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);
      const extrudeSettings = {
        steps: 2,
        depth: 4,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: 1,
        bevelOffset: 0,
        bevelSegments: 1,
      };
      const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = -Math.PI / 2; //绕X轴旋转90度
      scene.add(mesh);
    },

    initMap() {
      // 建一个空对象存放对象
      this.map = new THREE.Object3D();

      let _this = this;

      // 墨卡托投影转换
      const projection = d3
        .geoMercator()
        .center([120.750865, 30.762653])
        .scale(1000)
        .translate([0, 0]);

      JIAXING.features.forEach((elem) => {
        // 定一个省份3D对象
        const province = new THREE.Object3D();
        // 每个的 坐标 数组
        const coordinates = elem.geometry.coordinates;
        // 循环坐标数组
        coordinates.forEach((multiPolygon) => {
          multiPolygon.forEach((polygon) => {
            const shape = new THREE.Shape();
            const lineMaterial = new THREE.LineBasicMaterial({
              color: "white",
            });
            const lineGeometry = new THREE.Geometry();

            for (let i = 0; i < polygon.length; i++) {
              const [x, y] = projection(polygon[i]);
              if (i === 0) {
                shape.moveTo(x, -y);
              }
              shape.lineTo(x, -y);
              lineGeometry.vertices.push(new THREE.Vector3(x, -y, 4.01));
            }

            const extrudeSettings = {
              depth: 4,
              bevelEnabled: false,
            };

            const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
            const material = new THREE.MeshBasicMaterial({
              color: "#02A1E2",
              transparent: true,
              opacity: 0.6,
            });
            const material1 = new THREE.MeshBasicMaterial({
              color: "#3480C4",
              transparent: true,
              opacity: 0.5,
            });

            // let shaderMaterial = this.shaderMaterial();
            // const mesh = new THREE.Mesh(geometry, [material, shaderMaterial]);

            const mesh = new THREE.Mesh(geometry, [material, material1]);

            const line = new THREE.Line(lineGeometry, lineMaterial);
            province.add(mesh);
            province.add(line);
          });
        });

        // 将geo的属性放到省份模型中
        province.properties = elem.properties;
        if (elem.properties.contorid) {
          const [x, y] = projection(elem.properties.contorid);
          province.properties._centroid = [x, y];
        }
        province.rotation.x = -Math.PI / 2; //绕X轴旋转90度
        _this.map.add(province);
      });

      scene.add(this.map);
    },
    // shader
    shaderMaterial() {
      let vertexShader = `
        varying vec3 vNormal;
        void main() {
          vNormal = normal;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position.x, position.y * 1.4, position.z, 1.0 );
        }
      `;
      let fragmentShader = `
        varying vec3 vNormal;
        void main() {
          float pr = (vNormal.x + 1.0) / 2.0;
          float pg = (vNormal.y + 1.0) / 2.0;
          float pb = (vNormal.z + 1.0) / 2.0;
          gl_FragColor=vec4(pr, pg, pb, 1.0);
        }
      `;
      return new THREE.ShaderMaterial({
        uniforms: {
          time: {
            value: 1.0,
          },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
      });
    },

    setRaycaster() {
      this.raycaster = new THREE.Raycaster();
      this.mouse = new THREE.Vector2();
      this.eventOffset = {};
      var _this = this;
      function onMouseMove(event) {
        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components

        _this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        _this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        _this.eventOffset.x = event.clientX;
        _this.eventOffset.y = event.clientY;
        _this.$refs.provinceInfo.style.left = _this.eventOffset.x + 2 + "px"; // 动态设置提示框的位置
        _this.$refs.provinceInfo.style.top = _this.eventOffset.y + 2 + "px"; // 动态设置提示框的位置
        // console.log(_this.provinceInfo)
      }

      window.addEventListener("mousemove", onMouseMove, false);
    },

    createProvinceInfo() {
      // 显示省份的信息
      let _this = this
      _this.$nextTick(()=>{
        if (
          _this.activeInstersect.length !== 0 &&
          _this.activeInstersect[0].object.parent.properties.name
        ) {
          var properties = _this.activeInstersect[0].object.parent.properties;
  
          _this.$refs.provinceInfo.textContent = properties.name;
  
          _this.$refs.provinceInfo.style.visibility = "visible";
        } else {
          _this.$refs.provinceInfo.style.visibility = "hidden";
        }
        // console.log(_this.provinceInfo)
      })

    },

    render() {
      let clock = new THREE.Clock();
      let delta = clock.getDelta();
      requestAnimationFrame(this.render);

      this.raycaster.setFromCamera(this.mouse, camera);
      if (this.map) {
        // calculate objects intersecting the picking ray
        var intersects = this.raycaster.intersectObjects(
          this.map.children,
          true
        );
        if (this.activeInstersect && this.activeInstersect.length > 0) {
          this.activeInstersect.forEach((element) => {
            element.object.material[0].color.set("#02A1E2");
            element.object.material[1].color.set("#3480C4");
          });
        }

        this.activeInstersect = [];

        for (var i = 0; i < intersects.length; i++) {
          if (
            intersects[i].object.material &&
            intersects[i].object.material.length === 2
          ) {
            this.activeInstersect.push(intersects[i]);
            intersects[i].object.material[0].color.set(0xff0000);
            intersects[i].object.material[1].color.set(0xff0000);
            intersects[i].object.geometry.parameters.options.depth =
              Math.random() * 10;
            intersects[i].object.geometry.needsUpdate = true;
            break; // 只取第一个
          }
        }
        this.createProvinceInfo();
      }

      composer.render(delta); //使用组合器来渲染，而不再用webGLRenderer
      // renderer.render(scene, camera);
    },
  },
};

/* eslint-disable */
</script>
<style scoped lang="less">
#container {
  position: relative;
  width: 100vw;
  height: 100vh;
}
#provinceInfo {
  position: absolute;
  z-index: 2;
  background: white;
  padding: 10px;
  // visibility: hidden;
}
</style>
