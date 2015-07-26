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
//varying vec3 vLightDirection;
varying mat3 vTBN;

void main() {
   vPosition = (modelViewMat * vec4(position, 1.0)).xyz;
   vNormal   = (normalMat * vec4(normal, 0.0)).xyz;
   vTexCoords = texCoords;

// bump stuff
   vec3 tangent = vec3(1.0, 0.0, 0.0);
   vec3 binormal = cross(tangent, vNormal);
   vTBN = mat3(tangent, binormal, vNormal);

   gl_Position = transformation * vec4(position, 1.0);
}