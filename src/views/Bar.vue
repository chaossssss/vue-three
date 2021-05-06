<template>
  <div class="con" id="con">
    <div id="container"></div>
  </div>
</template>

<script>
/* eslint-disable */
import * as THREE from "three";
import * as Stats from "stats.js";
import * as TWEEN from "@tweenjs/tween.js";
// 粒子化立方体数据
let data = [
  {
    width: 5,
    height: 70,
    x: -50,
    num: 178260,
  },
  {
    width: 5,
    height: 65,
    x: -25,
    num: 152338,
  },
  {
    width: 5,
    height: 60,
    x: 0,
    num: 127303,
  },
  {
    width: 5,
    height: 55,
    x: 25,
    num: 52384,
  },
  {
    width: 5,
    height: 50,
    x: 50,
    num: 44176,
  },
];

// 需要用官方版本的tween.js
let container;
let camera, scene, renderer;
let cubeGroup,
  labelGroup = [];
let stats;
export default {
  name: "Bar",
  mounted(){
    let _this = this
    this.$nextTick(()=>{
      _this.init()
      _this.update()
    })
  },
  methods: {
    init() {
      let _this = this
      // scene
      scene = new THREE.Scene();
      container = document.getElementById("container");
      // camera
      let frustumSize = 150;
      let aspect = container.clientWidth / container.clientHeight;
      camera = new THREE.OrthographicCamera(
        (frustumSize * aspect) / -2,
        (frustumSize * aspect) / 2,
        frustumSize / 2,
        frustumSize / -2,
        1,
        1000
      );
      camera.position.set(0, 80, 200);
      camera.lookAt(new THREE.Vector3(0, 0, -200));

      // renderer
      renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      container.appendChild(renderer.domElement);

      renderer.render(scene, camera);

      let material = new THREE.SpriteMaterial({
        map: new THREE.CanvasTexture(this.generateSprite()),
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 1,
      });

      cubeGroup = new THREE.Group();
      scene.add(cubeGroup);
      data.forEach(function (params, index) {
        _this.initCube(params, material, index);
      });
      _this.updateLabel();

      stats = new Stats();
      container.appendChild(stats.dom);
      window.addEventListener("resize", _this.onWindowResize, false);
    },
    update() {
      requestAnimationFrame(this.update);
      TWEEN.update(undefined, true);
      renderer.render(scene, camera);
      stats.update();
    },
    initCube(params, material, index) {
      let _this = this
      let cube = new THREE.Group();

      let width = params.width; // 立方体宽
      let height = params.height; // 立方体高
      let space = 1; // 立方体面粒子间距

      let targetPos = [];
      // 粒子化立方体6个面
      for (let y = 0; y <= height; y += space) {
        for (let x = -width; x <= width; x += space * 2) {
          for (let z = -width; z <= width; z += space * 2) {
            if (y === 0 || y === height) {
              let particle = new THREE.Sprite(material);
              particle.position.set(x, 0, z);
              particle.scale.set(0.8, 0.8);
              cube.add(particle);
              targetPos.push(y);
            } else if (
              (x === -width && z === -width) ||
              (x === -width && z === width) ||
              (x === width && z === -width) ||
              (x === width && z === width)
            ) {
              let particle = new THREE.Sprite(material);
              particle.position.set(x, 0, z);
              cube.add(particle);
              targetPos.push(y);
            }
          }
        }
      }

      cube.position.x = params.x;
      cubeGroup.add(cube);

      _this.initLabel(params, cube);

      // 初始动画
      for (let i = 0; i < cube.children.length; i++) {
        new TWEEN.Tween(cube.children[i].position)
          .delay(index * 200)
          .to(
            {
              y: targetPos[i],
            },
            2000
          )
          .easing(TWEEN.Easing.Quadratic.Out)
          .start();
      }

      let tween = new TWEEN.Tween(cube.rotation)
        .delay(index * 200)
        .to(
          {
            y: THREE.Math.DEG2RAD * (720 + 30),
          },
          2000
        )
        .easing(TWEEN.Easing.Quadratic.Out)
        .onComplete(() => {
          tween.stop();
          labelGroup[index].className = "three-label active";
          // 立方体中间粒子
          _this.initParticles(cube, width, height, material);
        })
        .start();
    },
    initLabel(params) {
      let _this = this
      let ele = document.createElement("div");
      ele.className = "three-label";
      ele.innerHTML = _this.commafy(params.num, 0);
      container.appendChild(ele);

      labelGroup.push(ele);
    },
    updateLabel() {
      labelGroup.forEach(function (ele, index) {
        let params = data[index];

        let halfWidth = container.clientWidth / 2;
        let halfHeight = container.clientHeight / 2;
        let pos = new THREE.Vector3(params.x, params.height + 10, 0);

        let vector = pos.project(camera); // threejs 世界坐标转屏幕坐标

        let l = (1 + vector.x) * halfWidth;
        let t = (1 - vector.y) * halfHeight;
        ele.style.left = l - params.width / 2 - ele.clientWidth / 2 + "px";
        ele.style.top = t + "px";
      });
    },
    // 初始化立方体中间粒子
    initParticles(cube, width, height, material) {
      let particles = [];
      let flag = true;
      let timer = setInterval(() => {
        // 不断生成粒子
        if (!flag) clearInterval(timer);
        // 每次发射粒子数量
        for (let i = 0; i < Math.floor(height / 4); i++) {
          let _material = material.clone();
          _material.opacity = THREE.Math.randFloat(0.5, 1);
          let particle = new THREE.Sprite(_material);
          particle.position.set(
            THREE.Math.randFloat(-width, width),
            THREE.Math.randFloat(0, 5),
            THREE.Math.randFloat(-width, width)
          );
          particle.scale.set(Math.random() + 0.5, Math.random() + 0.5, 1);
          particles.push(particle);
          cube.add(particle);

          let tween = new TWEEN.Tween(particle.position)
            .delay(0)
            .to(
              {
                y: height - THREE.Math.randFloat(5, 30),
              },
              2500
            )
            .easing(TWEEN.Easing.Linear.None)
            .onComplete(() => {
              flag = false;
              particle.position.set(
                THREE.Math.randFloat(-width, width),
                0,
                THREE.Math.randFloat(-width, width)
              );
            })
            .start();
          tween.chain(tween);
        }
      }, 100);
    },
    generateSprite() {
      let canvas = document.createElement("canvas");
      canvas.width = 16;
      canvas.height = 16;

      let context = canvas.getContext("2d");
      let gradient = context.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2
      );
      gradient.addColorStop(0, "rgba(255,255,255,1)");
      gradient.addColorStop(0.2, "rgba(5, 172, 217,1)");
      gradient.addColorStop(0.4, "rgba(5, 94, 130,1)");
      gradient.addColorStop(1, "rgba(0,0,0,1)");

      context.fillStyle = gradient;
      context.fillRect(0, 0, canvas.width, canvas.height);

      return canvas;
    },
    onWindowResize() {
      let frustumSize = 200;
      let aspect = container.clientWidth / container.clientHeight;
      camera.left = (frustumSize * aspect) / -2;
      camera.right = (frustumSize * aspect) / 2;
      camera.top = frustumSize / 2;
      camera.bottom = frustumSize / -2;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      this.updateLabel();
    },
    commafy(num, fix) {
      try {
        if (num != null) {
          if (fix || fix == 0) {
            num = parseFloat(num).toFixed(fix) + "";
          } else {
            num += "";
          }
          let re = /(-?\d+)(\d{3})/;
          while (re.test(num)) {
            num = num.replace(re, "$1,$2");
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        return num;
      }
    },
  },
};
/* eslint-disable */
</script>
<style scoped lang="less">
.con {
  position: relative;
  width: 100vw;
  height: 100vh;
}
#container {
  width: 100vw;
  height: 100vh;
}
/deep/ .three-label {
  position: absolute;
  color: #ffffff;
  opacity: 0;
  transition: opacity 1s;
  text-shadow: 0 0 10px #ffffff, 0 0 20px #ffffff, 0 0 30px rgb(255, 0, 222),
    0 0 40px rgb(255, 0, 222), 0 0 70px rgb(255, 0, 222),
    0 0 80px rgb(255, 0, 222), 0 0 100px rgb(255, 0, 222);
}
/deep/ .three-label.active {
  opacity: 1;
}
</style>
