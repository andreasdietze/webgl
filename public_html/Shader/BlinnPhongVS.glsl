// init Attributes
attribute vec3 position;
attribute vec2 texCoords;
attribute vec3 normal;

// init Uniforms
uniform vec3 translation;
uniform mat4 transformation;
uniform mat4 normalMat;
uniform mat4 modelViewMat;

// init Varyings
varying vec3 vPosition;
varying vec2 vTexCoords;
varying vec3 vNormal;

void main() {
   vPosition = (modelViewMat * vec4(position, 1.0)).xyz;
   vNormal   = (normalMat * vec4(normal, 0.0)).xyz;
   vTexCoords = texCoords;
   gl_Position = transformation * vec4(position, 1.0);
}