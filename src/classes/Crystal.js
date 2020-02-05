import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'
import { TweenLite, Power4 } from 'gsap'

import crystalFrontFrag from '../shaders/crystalFront.frag'
import crystalFrontVert from '../shaders/crystalFront.vert'

import crystalBackFrag from '../shaders/crystalBack.frag'
import crystalBackVert from '../shaders/crystalBack.vert'

import outerLayerFrag from '../shaders/outerLayer.frag'
import outerLayerVert from '../shaders/outerLayer.vert'

import RaycastController from '../Controller/RaycastController'

import RAF from '../utils/raf'
import { BackSide } from 'three'

export default class Crystal {
    constructor(options) {
        this.bind()
        this.scene = options.scene
        this.camera = options.camera
        this.crystal
        this.rotAmp = 3
        this.actions = []
        this.clickFlag = false
        this.mixer

        var uniforms = {
            envMap: { value: options.envMap },
            backfaceMap: { value: options.backfaceMap },
            resolution: { value: options.resolution },
        }

        var outerLayerUniforms = {
            uTime: {
                value: 0
            },
            uMouse: {
                value: new THREE.Vector2(0, 0)
            },
            uResolution: {
                value: new THREE.Vector2(window.innerWidth, window.innerHeight)
            },
            blueMatCap: { value: new THREE.TextureLoader().load('/src/assets/matCapSatin.png') },
            camPos: { value: this.camera.position },
            uRad: { value: 0.1 },

        }


        this.frontMaterial = new THREE.ShaderMaterial({
            vertexShader: crystalFrontVert,
            fragmentShader: crystalFrontFrag,
            uniforms: uniforms
        })

        this.backMaterial = new THREE.ShaderMaterial({
            vertexShader: crystalBackVert,
            fragmentShader: crystalBackFrag,
            side: BackSide
        })


        this.outerLayerMaterial = new THREE.ShaderMaterial({
            vertexShader: outerLayerVert,
            fragmentShader: outerLayerFrag,
            uniforms: outerLayerUniforms,
            transparent: true
        })

        this.loader = new GLTFLoader()
        this.loader.load("/src/assets/crystal.glb", (glb) => {
            console.log(glb)
            this.crystal = glb.scene
            this.crystal.rotateY(-Math.PI / 4)
            this.mixer = new THREE.AnimationMixer(this.crystal)

            glb.animations.forEach((animation, i) => {
                this.actions.push(this.mixer.clipAction(animation))
            });

            this.crystal.traverse(child => {
                if (child instanceof THREE.Mesh) {
                    if (child.name == "outerLayer") {
                        child.material = this.outerLayerMaterial
                    }
                }
            })
            this.scene.add(this.crystal)
        })
    }

    onMouseIn() {
        TweenLite.to(this.outerLayerMaterial.uniforms.uRad, 1, {
            value: 1,
        })
        let initRot = this.crystal.rotation.y
        // TweenLite.to(this.crystal.rotation, 0.5, {
        //     y: initRot - this.rotAmp,
        //     ease: Power4.easeInOut()
        // })
        document.body.style = "cursor:pointer"
        this.clickFlag = true
    }

    onMouseOut() {
        TweenLite.to(this.outerLayerMaterial.uniforms.uRad, 1, {
            value: 0,
        })
        let initRot = this.crystal.rotation.y
        // TweenLite.to(this.crystal.rotation, 0.5, {
        //     y: initRot + this.rotAmp,
        //     ease: Power4.easeInOut()
        // })
        document.body.style = ""
        this.clickFlag = false
    }

    onClick() {
        if (!this.clickFlag)
            return
        this.actions.forEach(action => {
            action.reset()
            action.play(0)
        });

    }

    changeMat(opt) {
        if (this.crystal == undefined)
            return

        this.crystal.position.y = Math.sin(Date.now() * 0.001) * 0.2
        this.crystal.rotateY(0.001)


        this.crystal.traverse(child => {
            if (child instanceof THREE.Mesh) {
                if (child.name == "outerLayer") return

                if (opt == 0)
                    child.material = this.frontMaterial
                if (opt == 1)
                    child.material = this.backMaterial
            }
        })
    }

    update() {
        if (this.crystal == undefined)
            return
        this.outerLayerMaterial.uniforms.uTime.value += 1
        if (RaycastController.outerLayerUV != undefined) {
            this.outerLayerMaterial.uniforms.uMouse.value = RaycastController.outerLayerUV
            this.outerLayerMaterial.uniforms.camPos.value = this.camera.position

        }

        this.mixer.update(0.01)

    }

    bind() {
        this.update = this.update.bind(this)
        this.changeMat = this.changeMat.bind(this)
        this.onMouseIn = this.onMouseIn.bind(this)
        this.onMouseOut = this.onMouseOut.bind(this)
        this.onClick = this.onClick.bind(this)
        RAF.subscribe('crystalUpdate', this.update)
        RaycastController.assignMouseIn('outerLayer', this.onMouseIn, this.onMouseOut)

        window.addEventListener('click', this.onClick)
    }
}