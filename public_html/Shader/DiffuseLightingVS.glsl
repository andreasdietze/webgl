// init Attributes
attribute vec3 position;
attribute vec3 normal;
attribute vec3 color;

// init Uniforms
uniform mat4 transformation;
uniform mat4 normalMat;
uniform mat4 viewMat;

// init Varyings
varying vec3 vColor;
varying vec3 vLighting;

void main() {
   vColor =  vec3(0.7, 0.7, 0.3);
   gl_Position = transformation * vec4(position, 1.0);

   // set ambient color
   vec3 ambientLight = vec3(0.3, 0.3, 0.3);

   // set light color
   vec3 directionalLightColor = vec3(0.5, 0.5, 0.5);

   // set light direction
   vec3 directionalVector = (viewMat * vec4(1.0, 0.0, 1.0, 0.0)).xyz;

   // compute normalVector via normalMat * normal
   vec4 transformedNormal = normalMat * vec4(normal, 1.0);

   // compute Lambert-Factor
   float lambert = max(dot(transformedNormal.xyz, directionalVector), 0.0);
   vLighting = ambientLight + directionalLightColor * lambert;
}