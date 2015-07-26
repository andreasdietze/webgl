// init Attributes
attribute vec3 position;
attribute vec2 texCoords;
attribute vec3 normal;

// init Uniforms
uniform vec3 translation;
uniform mat4 transformation;
uniform mat4 normalMat;
uniform mat4 modelViewMat;
uniform mat4 viewMat;

// init Varyings
varying vec3 vPosition;
varying vec2 vTexCoords;
varying vec3 vNormal;
varying vec3 lightVec;
varying vec3 eyeVec;

void main() {
   vPosition = (modelViewMat * vec4(position, 1.0)).xyz;
   vNormal   = (normalMat * vec4(normal, 0.0)).xyz;
   vTexCoords = texCoords;

   vec3 n = normalize((normalMat * vec4(normal, 0.0)).xyz);
   vec3 t = normalize((normalMat * vec4(1.0, 0.0, 0.0, 0.0)).xyz);
   vec3 b = cross(n, t);

//"   vec3 tmpVec = vec3(vec3(0.0, 0.0, 5.0) - vPosition);
      vec3 tmpVec = normalize((viewMat * vec4(-1.0, 0.0, -1.0, 0.0)).xyz);
//"   vec3 tmpVec = normalize(vec3(-1.0, 0.0, -1.0));

   lightVec.x = dot(tmpVec, t);
   lightVec.y = dot(tmpVec, b);
   lightVec.z = dot(tmpVec, n);

   tmpVec = -vPosition;
   eyeVec.x = dot(tmpVec, t);
   eyeVec.y = dot(tmpVec, b);
   eyeVec.z = dot(tmpVec, n);

   gl_Position = transformation * vec4(position, 1.0);
}