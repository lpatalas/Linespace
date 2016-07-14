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