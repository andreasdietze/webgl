attribute vec3 position;
attribute vec2 texCoords;
uniform vec3 translation;
uniform mat4 transformation;
varying vec2 vTexCoords;
void main() {
   vTexCoords = texCoords;
   gl_Position = transformation * vec4(position, 1.0);
}