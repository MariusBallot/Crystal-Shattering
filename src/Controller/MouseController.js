import * as THREE from 'three'

class MouseController {
    constructor() {
        this.bind()
        this.mousePos = new THREE.Vector2(2000, 2000)
        this.mouse = new THREE.Vector2(0, 0)
    }

    mouseMove(event) {
        this.mousePos.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mousePos.y = - (event.clientY / window.innerHeight) * 2 + 1;

        this.mouse.x = event.clientX - window.innerWidth / 2
        this.mouse.y = event.clientY - window.innerHeight / 2
    }

    bind() {
        this.mouseMove = this.mouseMove.bind(this)
        window.addEventListener("mousemove", this.mouseMove, false)

    }
}

let _instance = new MouseController()
export default _instance