import * as THREE from 'three'
import RAF from '../utils/raf'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'



export default class BackgorundScene {
    constructor(scene, renderer) {
        this.bind()

        this.scene = scene
        this.renderer = renderer
        this.loader = new GLTFLoader()
        this.material = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('/src/assets/CrystalTexture.jpg')
        })
        this.cylinder

        this.loader.load('/src/assets/cylinder.glb', (glb) => {
            this.cylinder = glb.scene
            this.cylinder.traverse(child => {
                if (child instanceof THREE.Mesh) {
                    child.layers.set(1)
                    child.material = this.material
                }
            })
            this.scene.add(this.cylinder)
        })

        this.camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000)
        this.camera.position.set(0, 0, 15)
        this.camera.layers.set(1)
        this.camera.lookAt(this.scene.position)
    }

    update() {
        if (this.cylinder == undefined)
            return
        this.cylinder.rotateY(0.01)
        this.cylinder.rotateX(-0.015)
    }

    bind() {
        this.update = this.update.bind(this)
        RAF.subscribe('backgroundUpdate', this.update)
    }
}