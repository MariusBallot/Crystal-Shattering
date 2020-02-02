#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;

varying vec3 worldNormal;
varying vec2 vUv;

void main() {
    vec2 st = gl_FragCoord.xy/uResolution;
    float n = snoise3(vec3(vUv*10.,uTime*0.01));
    float a = smoothstep(0.1,0.15,n);

    float d = distance(st, uMouse);
    if(d<=.05){
        a = 0.;
    }

	gl_FragColor = vec4(worldNormal, 0.);
}