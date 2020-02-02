varying vec3 worldNormal;
varying vec2 vUv;

void main() {
    vUv = uv;
	worldNormal = normalize( modelViewMatrix * vec4(normal, 0.)).xyz;

	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}