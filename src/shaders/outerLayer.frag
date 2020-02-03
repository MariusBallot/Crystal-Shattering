#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: matcap = require(matcap)

uniform float uTime;
uniform float uRad;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform sampler2D blueMatCap;
uniform vec3 camPos;


varying vec3 worldNormal;
varying vec2 vUv;
varying vec2 vN;


void main() {
    vec2 st = gl_FragCoord.xy/uResolution;
    float n = snoise3(vec3(vUv*2.,uTime*0.01));
    float a = smoothstep(0.1,0.19,n);
    a+=0.2;
    vec2 matCapUv = matcap(camPos, worldNormal);

    // vec3 col = vec3(texture2D(blueMatCap, matCapUv).rgb);
    vec3 col = texture2D( blueMatCap, vN ).rgb;

    float d = distance(vUv, uMouse);
    
    a *= smoothstep(uRad,uRad+0.05,d);

	gl_FragColor = vec4(col, a);
}