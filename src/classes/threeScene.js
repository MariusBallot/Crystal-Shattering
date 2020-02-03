import * as THREE from "three"

import { GUI } from "three/examples/jsm/libs/dat.gui.module.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import RAF from '../utils/raf'

import BackgroundScene from "./BackgroundScene";
import RaycastController from "../Controller/RaycastController";
import Crystal from "./Crystal";

class ThreeScene {
  constructor() {
    this.bind()
    this.camera
    this.scene
    this.renderer
    this.controls

    this.composer
    this.bloomPass
    this.init()
  }

  init() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.debug.checkShaderErrors = true
    document.body.appendChild(this.renderer.domElement)

    this.scene = new THREE.Scene()
    // this.scene.background = new THREE.Color("red")

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    this.camera.position.set(0, 0, 5)
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enabled = true
    this.controls.maxDistance = 1500
    this.controls.minDistance = 0


    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 3, 1, 0.9);
    this.composer.addPass(this.bloomPass);

    // let light = new THREE.AmbientLight()
    // let pointLight = new THREE.PointLight()
    // pointLight.position.set(10, 10, 0)
    // this.scene.add(light, pointLight)



    this.backgroundScene = new BackgroundScene(this.scene, this.renderer)
    this.backgroundFBO = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight)
    this.backFaceFBO = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight)

    this.crystal = new Crystal({
      scene: this.scene,
      camera: this.camera,
      envMap: this.backgroundFBO.texture,
      backfaceMap: this.backFaceFBO.texture,
      resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
    })

    this.crystal.changeMat(1)
    this.renderer.autoClear = false


    RaycastController.scene = this.scene
    RaycastController.camera = this.camera

    this.myGUI()
  }

  myGUI() {

    var params = {
      exposure: 1,
      bloomStrength: 1.5,
      bloomThreshold: 0,
      bloomRadius: 0
    };
    var gui = new GUI();

    gui.add(params, "bloomThreshold", 0.0, 1.0).onChange(value => {
      this.bloomPass.threshold = Number(value);
    });

    gui.add(params, "bloomStrength", 0.0, 3.0).onChange(value => {
      this.bloomPass.strength = Number(value);
    });

    gui.add(params, "bloomRadius", 0.0, 1.0).step(0.01).onChange(value => {
      this.bloomPass.radius = Number(value);
    });
  }


  update() {
    this.renderer.setRenderTarget(this.backgroundFBO)
    this.scene.background = new THREE.Color(0x151515)
    this.renderer.clear()
    this.renderer.render(this.scene, this.backgroundScene.camera)

    this.crystal.changeMat(1)
    this.renderer.setRenderTarget(this.backFaceFBO)
    this.renderer.clearDepth()
    this.renderer.render(this.scene, this.camera)

    this.renderer.setRenderTarget(null)
    this.renderer.render(this.scene, this.backgroundScene.camera);
    this.renderer.clearDepth()


    this.crystal.changeMat(0)
    this.scene.background = null
    this.renderer.render(this.scene, this.camera);
  }


  resizeCanvas() {
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
  }

  bind() {
    this.resizeCanvas = this.resizeCanvas.bind(this)
    this.update = this.update.bind(this)

    window.addEventListener("resize", this.resizeCanvas)
    RAF.subscribe('threeSceneUpdate', this.update)
  }
}

export {
  ThreeScene as
    default
}
