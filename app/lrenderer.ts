import * as console from 'console';
import * as THREE from 'three';

export class lrenderer {
	constructor() {
		const container = <HTMLCanvasElement>document.getElementById('gameCanvas');

		// var camera = new THREE.Camera();
		// camera.position.z = 1;
		this.scene = new THREE.Scene();
		//		var geometry = new THREE.PlaneBufferGeometry(2, 2);
		// 		var uniforms = {
		// 			time: { value: 1.0 },
		// 			resolution: { value: new THREE.Vector2() }
		// 		};
		// 		var material = new THREE.ShaderMaterial({
		// 			uniforms: uniforms,
		// 			vertexShader: `
		// precision mediump float;

		// varying vec3 vColor;

		// void main() {
		//     gl_FragColor = vec4(vColor, 1);
		// }
		// `,
		// 			fragmentShader: `
		// precision mediump float;

		// uniform float scale;
		// uniform float rotationSpeed;
		// uniform float time;
		// uniform vec2 viewportSize;            

		// attribute vec4 starParams;
		// attribute vec3 color;

		// varying vec3 vColor;

		// void main() {
		//     float initialRotation = starParams.x;
		//     float longerRadius = starParams.y;
		//     float orbitRotation = starParams.z;
		//     float shorterRadius = starParams.w;

		//     float r = initialRotation + time * rotationSpeed;
		//     float x = sin(r) * longerRadius * scale;
		//     float y = cos(r) * shorterRadius * scale;

		//     float xx = x * cos(orbitRotation) - y * sin(orbitRotation);
		//     float yy = x * sin(orbitRotation) + y * cos(orbitRotation);

		//     vec2 vpos = vec2(xx, yy);
		//     vec2 screenPos = vpos / (viewportSize * 0.5);

		//     gl_Position = vec4(screenPos.x, screenPos.y, 0, 1);
		//     gl_PointSize = 3.0;

		//     vColor = color;
		// }
		//                     `
		// 		});
		// var mesh = new THREE.Mesh(geometry, material);
		// scene.add(mesh);
		// var renderer = new THREE.WebGLRenderer();
		// renderer.setPixelRatio(window.devicePixelRatio);
		// container.appendChild(renderer.domElement);

		// var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 50);
		// camera.position.z = 30;


		this.camera = new THREE.Camera();
		this.camera.position.z = 1;

		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setClearColor(0x000000, 1);
		document.body.appendChild(this.renderer.domElement);

		var dotGeometry = new THREE.Geometry();
		dotGeometry.vertices.push(new THREE.Vector3(10, 10, 0));
		var dotMaterial = new THREE.PointsMaterial({ size: 100, sizeAttenuation: false, color: 0xff0000 });
		var dot = new THREE.Points(dotGeometry, dotMaterial);

		var mesh = new THREE.Mesh(dotGeometry, dotMaterial);
		this.scene.add(mesh);
		this.renderer.render(this.scene, this.camera);
	}
	
	scene: THREE.Scene;
	camera: THREE.Camera;
	renderer: THREE.WebGLRenderer;	

	render() {

		requestAnimationFrame(this.render);

		var time = Date.now() * 0.001;

		// if (!options.fixed) {

		// 	mesh.rotation.x += 0.005;
		// 	mesh.rotation.y += 0.005;

		// }

		this.renderer.render(this.scene, this.camera);
	};


}