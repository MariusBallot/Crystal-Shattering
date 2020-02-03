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
        this.mouseInSubs = []
    }

    assignMouseIn(objName, fct) {
        var sub = {
            objName: objName,
            fct: fct,
        }
        this.mouseInSubs.push(sub)
        console.log(this.mouseInSubs)
    }

    update() {
        this.raycaster.setFromCamera(this.mouse, this.camera);

        var intersects = this.raycaster.intersectObjects(this.scene.children, true);

        for (var i = 0; i < intersects.length; i++) {
            this.mouseInSubs.forEach((sub, j) => {
                if (sub.objName == intersects[i].object.name) {
                    sub.fct()
                }
            });


            if (intersects[i].object.name == 'outerLayer') {
                this.outerLayerUV = intersects[i].uv
                if (this.onRaycast == undefined)
                    return
            }

        }
    }
    bind() {
        this.update = this.update.bind(this)
        this.assignMouseIn = this.assignMouseIn.bind(this)
        RAF.subscribe("raycastUpdate", this.update)
    }

}

let _instance = new RaycastController()
export default _instance