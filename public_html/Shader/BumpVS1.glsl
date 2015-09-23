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
uniform mat4 viewMat;

// init Varyings
varying vec3 vPosition;
varying vec2 vTexCoords;
varying vec3 vNormal;
varying vec3 vLightVec;
varying vec3 vEyeVec;
varying vec3 vHalfVec;

void main() {
   vPosition = (modelViewMat * vec4(position, 1.0)).xyz;
   vNormal   = (normalMat * vec4(normal, 0.0)).xyz;
   vTexCoords = texCoords;

   vec3 n = normalize((normalMat * vec4(normal, 0.0)).xyz);
   vec3 t;
   if(tangent.x != 0.0){
	 t = normalize((normalMat * vec4(tangent, 0.0)).xyz); 
	} else {
	 t = normalize((normalMat * vec4(1.0, 0.0, 0.0, 0.0)).xyz);  
	}
   vec3 b = normalize((viewMat * vec4(cross(n, t), 0.0)).xyz);  // viewMat
   //vec3 b = normalize(cross(n, t));
   //vec3 b = cross(n, t);

   // vec3 tmpVec = vec3(vec3(0.0, 0.0, 5.0) - vPosition);
    vec3 tmpVec = normalize((viewMat * vec4(-1.0, 0.0, -1.0, 0.0)).xyz);  // viewMat
	//vec3 tmpVec =  (viewMat * vec4(0.0, 0.0, 1.0, 0.0)).xyz;
	//tmpVec = normalize(tmpVec - vPosition);
   // vec3 tmpVec = normalize(vec3(-1.0, 0.0, -1.0));

   vLightVec.x = dot(tmpVec, t);
   vLightVec.y = dot(tmpVec, b);
   vLightVec.z = dot(tmpVec, n);

   tmpVec = -vPosition;
   vEyeVec.x = dot(tmpVec, t);
   vEyeVec.y = dot(tmpVec, b);
   vEyeVec.z = dot(tmpVec, n);
   
   tmpVec = (vLightVec + vEyeVec );  // +normalize(vEyeVec)
   vHalfVec.x = dot(tmpVec, t);
   vHalfVec.y = dot(tmpVec, b);
   vHalfVec.z = dot(tmpVec, n);
   //vHalfVec = normalize(vHalfVec);
   
   gl_Position = transformation * vec4(position, 1.0);
}