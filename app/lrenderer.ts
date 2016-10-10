import * as THREE from 'three';

export class lrenderer{
    init(){

        const container = <HTMLCanvasElement>document.getElementById('gameCanvas');

				var camera = new THREE.Camera();
				camera.position.z = 1;
				var scene = new THREE.Scene();
				var geometry = new THREE.PlaneBufferGeometry( 2, 2 );
				var uniforms = {
					time:       { value: 1.0 },
					resolution: { value: new THREE.Vector2() }
				};
				var material = new THREE.ShaderMaterial( {
					uniforms: uniforms,
					vertexShader: `
                    precision mediump float;

varying vec3 vColor;

void main() {
    gl_FragColor = vec4(vColor, 1);
}
`,
					fragmentShader: `
                    precision mediump float;

uniform float scale;
uniform float rotationSpeed;
uniform float time;
uniform vec2 viewportSize;            

attribute vec4 starParams;
attribute vec3 color;

varying vec3 vColor;

void main() {
    float initialRotation = starParams.x;
    float longerRadius = starParams.y;
    float orbitRotation = starParams.z;
    float shorterRadius = starParams.w;

    float r = initialRotation + time * rotationSpeed;
    float x = sin(r) * longerRadius * scale;
    float y = cos(r) * shorterRadius * scale;

    float xx = x * cos(orbitRotation) - y * sin(orbitRotation);
    float yy = x * sin(orbitRotation) + y * cos(orbitRotation);

    vec2 vpos = vec2(xx, yy);
    vec2 screenPos = vpos / (viewportSize * 0.5);

    gl_Position = vec4(screenPos.x, screenPos.y, 0, 1);
    gl_PointSize = 3.0;

    vColor = color;
}
                    `
				} );
				var mesh = new THREE.Mesh( geometry, material );
				scene.add( mesh );
				var renderer = new THREE.WebGLRenderer();
				renderer.setPixelRatio( window.devicePixelRatio );
				container.appendChild( renderer.domElement );
				//var stats = new Stats();
				//container.appendChild( stats.dom );
				//onWindowResize();
				//window.addEventListener( 'resize', onWindowResize, false );

    }
}