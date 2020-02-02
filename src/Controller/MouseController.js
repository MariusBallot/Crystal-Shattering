import * as THREE from 'three'

class MouseController {
    constructor() {
        this.bind()
        this.mousePos = new THREE.Vector2(2000, 2000)
    }

    mouseMove(event) {
        this.mousePos.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mousePos.y = - (event.clientY / window.innerHeight) * 2 + 1;
    }

    bind() {
        this.mouseMove = this.mouseMove.bind(this)
        window.addEventListener("mousemove", this.mouseMove, false)

    }
}

let _instance = new MouseController()
export default _instance