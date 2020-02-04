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

    assignMouseIn(objName, fctIn, fctOut) {
        var sub = {
            objName: objName,
            fctIn: fctIn,
            fctOut: fctOut || null,
            flag: true,
        }
        this.mouseInSubs.push(sub)
    }

    update() {
        this.raycaster.setFromCamera(this.mouse, this.camera);

        var intersects = this.raycaster.intersectObjects(this.scene.children, true);

        intersects.forEach(intersect => {

            if (intersect.object.name == 'outerLayer') {
                this.outerLayerUV = intersect.uv
            }

            this.mouseInSubs.forEach((sub, j) => {
                if (sub.objName == intersect.object.name) {
                    if (sub.flag == true) {
                        sub.fctIn()
                        console.log('ko')
                        sub.flag = false
                    }
                }
            })
        })

        this.mouseInSubs.forEach(sub => {
            let intflag = true
            let lastBool = sub.flag
            intersects.forEach((intersect, i) => {
                if (intflag) {
                    sub.flag = true
                    if (sub.objName == intersect.object.name) {
                        sub.flag = false
                        intflag = false
                    }
                    if (i == intersects.length - 1) {
                        intflag = false
                    }
                }
            })

            if (lastBool != sub.flag) {
                console.log('changStat')
                if (sub.fctOut != null)
                    sub.fctOut()
            }

            lastBool = sub.flag
        });
    }
    bind() {
        this.update = this.update.bind(this)
        this.assignMouseIn = this.assignMouseIn.bind(this)
        RAF.subscribe("raycastUpdate", this.update)
    }

}

let _instance = new RaycastController()
export default _instance