<template>
  <div class="hello">
    <div id="container"></div>
    <!-- <div id="label">立方体</div> -->
  </div>
</template>

<script>
/* eslint-disable */
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
const OrbitControls = require("three-orbit-controls")(THREE);
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
import DragControls from "drag-controls";
DragControls.install({ THREE: THREE });
// 辅助工具
import * as dat from "dat.gui";
import * as Stats from "stats.js";
import { GridHelper, AxesHelper } from "three";
var stats = new Stats();
var scene,
  camera,
  renderer,
  objects = [];
var model, mixer, clock, curve, orbitControls;
var composer, outlinePass, renderPass;
var duckGroup,outerMesh,duckModel,duckSize
// var projectiveObj,currentProjectiveObjT;
// var width = window.innerWidth; //全屏状态对应窗口宽度
// var height = window.innerHeight; //全屏状态对应窗口高度
clock = new THREE.Clock();
var progress = 0;
export default {
  name: "Demo2",
  data() {
    return {};
  },
  mounted() {
    this.init();
    window.addEventListener("click", this.getIntersects, false);
    this.curve();
    this.robot();
    this.duck()
    this.duck2()
    this.animate();
    this.drag();
    this.dat();
  },
  methods: {
    init() {
      // 创建场景
      scene = new THREE.Scene();
      let container = document.getElementById("container");

      // 状态栏
      stats.showPanel(0);
      container.appendChild(stats.dom);

      // 创建相机
      camera = new THREE.PerspectiveCamera( // 透视投影相机
        40, // 视场，表示能够看到的角度范围
        window.innerWidth / window.innerHeight, // 渲染窗口的长宽比，设置为浏览器窗口的长宽比
        0.1, // 从距离相机多远的位置开始渲染
        2000 // 距离相机多远的位置截止渲染
      );
      camera.position.set(-10, 10, 40); // 设置相机位置

      // 点光源
      const pointLight = new THREE.PointLight(0xffffff, 1, 10000);
      pointLight.position.set(15, 60, 16);
      pointLight.castShadow = true;
      const pointLightHelper = new THREE.PointLightHelper(pointLight, 8);
      scene.add(pointLight);
      scene.add(pointLightHelper);

      // 创建渲染器
      renderer = new THREE.WebGLRenderer({
        antialias: true, // 是否执行抗锯齿
      });
      // composer = new THREE.EffectComposer(renderer);
      renderer.setPixelRatio(window.devicePixelRatio); // 设置设备像素比率。通常用于HiDPI设备，以防止输出画布模糊。
      renderer.setSize(window.innerWidth, window.innerHeight); // 设置渲染器大小
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      container.appendChild(renderer.domElement);

      // var FXAAShaderPass = new ShaderPass(FXAAShader);
      // FXAAShaderPass.uniforms['resolution'].value.set(1 / width, 1 / height);
      // FXAAShaderPass.renderToScreen = true;
      // composer.addPass(FXAAShaderPass);

      // 创建控制器
      orbitControls = new OrbitControls(camera, renderer.domElement);

      // 创建物体
      const geometry = new THREE.BoxBufferGeometry(4, 4, 4); // 生成几何体
      const material = new THREE.MeshStandardMaterial({
        // 生成材质
        color: 0x00ff00,
      });
      const mesh = new THREE.Mesh(geometry, material); // 生成网格
      mesh.castShadow = true; // 对象是否渲染到阴影贴图中，默认值为false
      // mesh.receiveShadow = false
      mesh.name = "cube";
      objects.push(mesh);
      mesh.position.set(0, 2, 0); // 设置物体位置
      scene.add(mesh); // 添加到场景中

      // 球
      const sphereGeometry = new THREE.SphereGeometry(2, 20, 20);
      const sphereMaterial = new THREE.MeshStandardMaterial({
        color: 0x7777ff,
      });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.castShadow = true;
      sphere.name = "sphere";
      sphere.position.set(-10, 2, -8);
      objects.push(sphere);
      scene.add(sphere);

      // 创建平面
      const planeGeometry = new THREE.PlaneGeometry(300, 300); // 生成平面几何
      const planeMaterial = new THREE.MeshLambertMaterial({
        // 生成材质
        color: 0xcccccc,
      });
      const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial); // 生成平面网格
      planeMesh.receiveShadow = true; // 设置平面网格为接受阴影的投影面
      planeMesh.rotation.x = -Math.PI / 2; //绕X轴旋转90度
      planeMesh.name = "plane";
      scene.add(planeMesh); // 添加到场景中

      // 平面
      const gridHelper = new THREE.GridHelper(300, 300);
      scene.add(gridHelper);

      // 环境光
      scene.add(new THREE.AmbientLight(0xffffff));

      // 辅助线
      const axex2 = new THREE.AxisHelper(20);
      scene.add(axex2);

      // 组
      const group1 = new THREE.Group();
      group1.add(mesh);
      group1.add(sphere);
      scene.add(group1);

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

      const cameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
      scene.add(cameraHelper);
    },
    // 机器人
    robot() {
      let gltfLoader = new GLTFLoader().setPath("/model/gltf/");
      gltfLoader.load("RobotExpressive.glb", function (gltf) {
        model = gltf.scene;
        // console.log(gltf.animations);
        model.traverse((object) => {
          object.castShadow = true;
        });
        model.name = "robot";
        model.position.set(15, 0, -15);
        // console.log("gltf", gltf);
        // objects.push(model)
        scene.add(model);
        mixer = new THREE.AnimationMixer(model);
        mixer.clipAction(gltf.animations[10]).setDuration(1).play();
      });
    },
    duck(){
      let gltfLoader = new GLTFLoader().setPath("/model/Duck/glTF/")
      gltfLoader.load("Duck.gltf",function(gltf){
        console.log(gltf)
        duckModel = gltf.scene
        duckModel.position.set(10,0,10)
        duckModel.name = "duck"
        duckModel.traverse((object) => {
          object.castShadow = true;
        });
        let duckBox = new THREE.Box3().setFromObject(duckModel)
        duckSize = duckBox.size()
        let duckGeometry = new THREE.BoxGeometry(duckSize.x,duckSize.y,duckSize.z)
        let duckMaterial = new THREE.MeshBasicMaterial({
          color: 0xfff,
          transparent: true,
          opacity: 0
        })
        outerMesh = new THREE.Mesh(duckGeometry,duckMaterial)
        outerMesh.name = "duckOuter"
        outerMesh.position.set(10,duckSize.y/2,10)
        objects.push(outerMesh)
        scene.add(outerMesh)
        // console.log("duckSize",duckSize)
        scene.add(duckModel)
      })
    },
    duck2(){
      let _this = this
      let gltfLoader = new GLTFLoader().setPath("/model/Duck/glTF/")
      gltfLoader.load("Duck.gltf",function(gltf){
        let material = new THREE.PointsMaterial({
          color: 0xffffff,
          size: 0.6,
          opacity: 0.8,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthTest: false,
          map: _this.generateSprite()
        })

        // gltf.scene.traverse(function(child){
        //   if(child instanceof THREE.Mesh){
        //     child.material = material
        //   }
        // })
        // gltf.scene.position.set(12,0,12)
        // scene.add(gltf.scene)


        let mesh = new THREE.Points(gltf.scene,material)
        mesh.scale.set(1,1,1)
        mesh.position.set(12,0,12)
        // mesh.center()
        // gltf.scene.center()
        // gltf.scene.position.set(12,0,12)
        scene.add(mesh)

      })
    },
    generateSprite(){
      let canvas = document.createElement('canvas')
      canvas.width = 16
      canvas.height = 16

      let context = canvas.getContext('2d')
      let gradient = context.createRadialGradient((canvas.width / 2).toFixed(2), (canvas.height / 2).toFixed(2), 0, (canvas.width / 2).toFixed(2), (canvas.height / 2).toFixed(2), (canvas.width / 2).toFixed(2))
      gradient.addColorStop(0,'rgba(255,255,255,1)')
      gradient.addColorStop(0.2,'rgba(0,255,255,1)')
      gradient.addColorStop(0.4,'rgba(0,0,64,1)')
      gradient.addColorStop(1,'rgba(0,0,0,1)')

      context.fillStyle = gradient
      context.fillRect(0,0,canvas.width,canvas.height)
      
      let texture = new THREE.Texture(canvas)
      texture.needsUpdate = true
      return texture
    },
    animate() {
      requestAnimationFrame(this.animate);
      stats.update();
      var time = clock.getDelta();
      if (mixer) {
        mixer.update(time);
      }
      if (model) {
        if (progress > 1) {
          progress = 0;
          return;
        }
        progress += 0.002;
        if (curve) {
          let point = curve.getPoint(progress);
          let point1 = curve.getPoint(progress + 0.001);
          if (point && point.x) {
            model.position.set(point.x, point.y, point.z);
            model.lookAt(point1.x, point1.y, point1.z);
          }
        }
      }
      // renderer.render(scene, camera);
      if (composer) {
        composer.render();
      }
    },
    // 曲线
    curve() {
      curve = new THREE.CatmullRomCurve3(
        [
          new THREE.Vector3(0, 0, 20),
          new THREE.Vector3(-20, 0, 0),
          new THREE.Vector3(0, 0, -20),
          new THREE.Vector3(20, 0, 0),
        ],
        true
      );
      const points = curve.getPoints(500);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);

      const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

      // Create the final object to add to the scene
      const curveObject = new THREE.Line(geometry, material);
      curveObject.name = "curve";
      scene.add(curveObject);
    },
    // 获取物体
    getIntersects(event) {
      event.preventDefault();

      // 声明 raycaster 和 mouse 变量
      var raycaster = new THREE.Raycaster();
      var mouse = new THREE.Vector2();

      // 通过鼠标点击位置,计算出 raycaster 所需点的位置,以屏幕为中心点,范围 -1 到 1
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      //通过鼠标点击的位置(二维坐标)和当前相机的矩阵计算出射线位置
      raycaster.setFromCamera(mouse, camera);

      // 获取与射线相交的对象数组，其中的元素按照距离排序，越近的越靠前
      let intersects = raycaster.intersectObjects(scene.children, true);

      intersects = intersects.filter((intersect) => {
        return (
          !(intersect.object instanceof GridHelper) &&
          !(intersect.object instanceof AxesHelper) &&
          intersect.object.name !== "plane" &&
          intersect.object.name !== "curve"
        );
      });
      //返回选中的对象
      console.log(intersects);
      // let sphereObj = intersects.filter(item=>{
      //   return item.object.name == 'sphere'
      // })
      // if(sphereObj){
      //   this.outlineObj(sphereObj[0].object)
      // }
      return intersects;
    },
    // 拖动方法
    drag() {
      console.log("scene.children", scene.children);
      console.log(objects);
      // 初始化拖拽控件
      let dragControls = new DragControls(objects, camera, renderer.domElement);
      dragControls.addEventListener("dragstart", function (event) {
        orbitControls.enabled = false;
        console.log("dragstart", event);

      });
      dragControls.addEventListener("drag",function(event){
        if(event.object.name == 'duckOuter'){
          duckModel.position.x = event.object.position.x
          duckModel.position.y = event.object.position.y - duckSize.y/2
          duckModel.position.z = event.object.position.z
        }
      })
      dragControls.addEventListener("dragend", function (event) {
        orbitControls.enabled = true;
        console.log("dragend", event);
        if(event.object.name == 'duckOuter'){
          duckModel.position.x = event.object.position.x
          duckModel.position.y = event.object.position.y - duckSize.y/2
          duckModel.position.z = event.object.position.z
        }
      });
    },
    // control
    dat() {
      let controls = new (function () {
        this.rotationSpeed = 0.02;
      })();
      var gui = new dat.GUI();
      gui.add(controls, "rotationSpeed", 0, 0.5);
    },
    //高亮显示模型（呼吸灯）
    outlineObj(selectedObjects) {
      // 创建一个EffectComposer（效果组合器）对象，然后在该对象上添加后期处理通道。
      composer = new EffectComposer(renderer);
      // 新建一个场景通道  为了覆盖到原理来的场景上
      renderPass = new RenderPass(scene, camera);
      composer.addPass(renderPass);
      // 物体边缘发光通道
      outlinePass = new OutlinePass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        scene,
        camera,
        selectedObjects
      );
      outlinePass.selectedObjects = selectedObjects;
      outlinePass.edgeStrength = 10.0; // 边框的亮度
      outlinePass.edgeGlow = 1; // 光晕[0,1]
      outlinePass.usePatternTexture = false; // 是否使用父级的材质
      outlinePass.edgeThickness = 1.0; // 边框宽度
      outlinePass.downSampleRatio = 1; // 边框弯曲度
      outlinePass.pulsePeriod = 5; // 呼吸闪烁的速度
      outlinePass.visibleEdgeColor.set(parseInt(0x00ff00)); // 呼吸显示的颜色
      outlinePass.hiddenEdgeColor = new THREE.Color(0, 0, 0); // 呼吸消失的颜色
      outlinePass.clear = true;
      composer.addPass(outlinePass);
      // 自定义的着色器通道 作为参数
      var effectFXAA = new ShaderPass(FXAAShader);
      effectFXAA.uniforms.resolution.value.set(
        1 / window.innerWidth,
        1 / window.innerHeight
      );
      effectFXAA.renderToScreen = true;
      composer.addPass(effectFXAA);
    },
  },
};
/* eslint-disable */
</script>
<style scoped lang="less">
</style>
