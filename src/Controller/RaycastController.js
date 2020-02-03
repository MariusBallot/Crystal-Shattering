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
            flag: true,
        }
        this.mouseInSubs.push(sub)
    }

    update() {
        this.raycaster.setFromCamera(this.mouse, this.camera);

        var intersects = this.raycaster.intersectObjects(this.scene.children, true);

        // for (var i = 0; i < intersects.length; i++) {
        //     this.mouseInSubs.forEach((sub, j) => {
        //         if (sub.objName == intersects[i].object.name) {
        //             if (sub.flag == true) {
        //                 sub.fct()
        //                 sub.flag = false
        //             }
        //             return
        //         } else {
        //             console.log(sub.flag)
        //             sub.flag = true
        //         }
        //     })

        //     if (intersects[i].object.name == 'outerLayer') {
        //         this.outerLayerUV = intersects[i].uv
        //         if (this.onRaycast == undefined)
        //             return
        //     }

        // }

        this.mouseInSubs.forEach((sub, j) => {
            intersects.forEach((intersect) => {
                if (sub.objName == intersect.object.name) {
                    if (sub.flag == true) {
                        sub.fct()
                        sub.flag = false
                        console.log(sub.flag)
                    }
                }
                if (sub.objName != intersect.object.name) {
                    if (sub.flag == false) {
                        sub.fct()
                        sub.flag = true
                        console.log(sub.flag)
                    }
                }
            })
        })
    }
    bind() {
        this.update = this.update.bind(this)
        this.assignMouseIn = this.assignMouseIn.bind(this)
        RAF.subscribe("raycastUpdate", this.update)
    }

}

let _instance = new RaycastController()
export default _instance