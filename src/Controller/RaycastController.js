import * as THREE from 'three'
import MouseController from "./MouseController"

import RAF from "../utils/raf"

class RaycastController {
    constructor() {
        this.bind()
        this.scene
        this.camera
        this.mouse = MouseController.mousePos
        this.raycaster = new THREE.Raycaster()
        this.outerLayerUV

    }

    update() {
        this.raycaster.setFromCamera(this.mouse, this.camera);

        var intersects = this.raycaster.intersectObjects(this.scene.children, true);

        for (var i = 0; i < intersects.length; i++) {
            if (intersects[i].object.name == 'outerLayer') {
                this.outerLayerUV = intersects[i].uv
            }
        }
    }
    bind() {
        this.update = this.update.bind(this)
        RAF.subscribe("raycastUpdate", this.update)
    }

}

let _instance = new RaycastController()
export default _instance