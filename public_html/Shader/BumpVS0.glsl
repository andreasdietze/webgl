// init Attributes
attribute vec3 position;
attribute vec2 texCoords;
attribute vec3 normal;
attribute vec3 tangent;

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
   //vec3 tangent = vec3(1.0, 0.0, 0.0);
   vec3 tangent = (normalMat * vec4(tangent, 0.0)).xyz;
   vec3 binormal = cross(tangent, vNormal);
   //binormal = (normalMat * vec4(binormal, 0.0)).xyz;
   mat3 tbn = mat3(tangent, binormal, vNormal);
   //vTBN = transpose(tbn);
   vTBN = tbn;

   gl_Position = transformation * vec4(position, 1.0);
}