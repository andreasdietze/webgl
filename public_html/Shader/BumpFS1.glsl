uniform mat4 viewMat;
uniform mat4 normalMat;

// Material
uniform sampler2D tex;
uniform sampler2D bumpMap;
uniform int texTrue;
uniform vec3 Ka;
uniform vec3 Kd;
uniform vec3 Ks;
uniform vec3 Ke;

// Lighting
uniform int lighting;
uniform vec3 ambientColor;
uniform vec3 lightColor;
uniform vec3 specularColor;
uniform float shininess;
uniform float diffIntensity;
uniform float specIntensity;

// Varyings
varying vec3 vPosition;
varying vec2 vTexCoords;
varying vec3 vNormal;
varying vec3 vLightVec;
varying vec3 vEyeVec;
varying vec3 vHalfVec;

void main() {
   // colors 
   vec3 diffuseColor = vec3(1.0, 1.0, 1.0);
   float distSqr = dot(vLightVec, vLightVec);
   float att = clamp(1.0 * sqrt(distSqr), 0.0, 1.0);
   vec3 lVec = vLightVec * inversesqrt(distSqr);

   vec3 vVec = normalize(vEyeVec);
   vec3 base = vec3(texture2D(tex, vTexCoords));
   vec3 bump = normalize(texture2D(bumpMap, vTexCoords).xyz * 2.0 - 1.0);
   //vec3 half = normalize(vHalfVec);
   //bump = normalize(bump);
   vec3 vAmbient = ambientColor;
   float diffuse = max(dot(bump, lVec), 0.0);  // lVec
   vec3 vDiffuse = base * lightColor * diffuse;  // diffuseColor
   float specular = pow(clamp(dot(reflect(-lVec, bump), vVec), 0.0, 1.0), shininess);
   //float specular = pow(max(dot(bump, -vVec), 0.0), shininess);
   vec3 vSpecular = specularColor * specular;

   //gl_FragColor = vec4((vAmbient * base + vDiffuse * base * diffIntensity + vSpecular * specIntensity) * att, 1.0);
   gl_FragColor = vec4((vAmbient + vDiffuse * diffIntensity + vSpecular * specIntensity) * att, 1.0);
	  
}