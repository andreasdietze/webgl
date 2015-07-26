attribute vec3 position;
attribute vec3 color;
uniform mat4 transformation;
varying vec3 vColor;
void main() {
   gl_Position = transformation * vec4(position, 1.0);
   vColor = color;
}