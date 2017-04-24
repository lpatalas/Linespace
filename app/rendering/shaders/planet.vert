precision mediump float;

uniform float time;
uniform vec2 translation;
uniform vec2 viewportSize;

// color: Rgb;
attribute vec3 color;

// argumentOfPeriapsis: Radians;
// semiMajorAxis: number;
// samiMinorAxis: number;
attribute vec3 orbitParams;

// initialPosition: Radians;
// orbitalPeriod: Seconds;
attribute vec2 positionParams;

varying vec3 vColor;

const float PI = 3.1415;
const float TWO_PI = 6.2832;

void main() {
	float argumentOfPeriapsis = orbitParams.x;
	float semiMajorAxis = orbitParams.y;
	float samiMinorAxis = orbitParams.z;

	float initialPosition = positionParams.x;
	float orbitalPeriod = positionParams.y;

	float p = initialPosition + (time / orbitalPeriod) * TWO_PI;
    float x = sin(p) * semiMajorAxis;
    float y = cos(p) * samiMinorAxis;

    float xx = x * cos(argumentOfPeriapsis) - y * sin(argumentOfPeriapsis);
    float yy = x * sin(argumentOfPeriapsis) + y * cos(argumentOfPeriapsis);

    vec2 vpos = vec2(xx, yy) + translation;
    vec2 screenPos = vpos / (viewportSize * 0.5);

    gl_Position = vec4(screenPos.x, screenPos.y, 0, 1);
    gl_PointSize = 10.0;

    vColor = color;
}
