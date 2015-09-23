uniform sampler2D tex;
uniform sampler2D bumpMap;

uniform mat4 normalMat;
uniform mat4 viewMat;

varying vec2 vTexCoords;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vEyeVec;
varying vec3 vLightVec;
varying vec3 vHalfVec;

void main() {

	// Extract the normal from the normal map
    vec3 normal = texture2D(bumpMap, vTexCoords).rgb * 2.0 - 1.0;
    vec3 ambiente = vec3(0.1, 0.1, 0.1);
     
	// Calculate the lighting diffuse value
	float NdotL = max(dot(normal, vLightVec), 0.0);
	vec3 base = vec3(texture2D(tex, vTexCoords));
	vec3 diffuse = base * NdotL * vec3(0.9, 0.9, 0.9);
	
	float sNdotL = pow(max(dot(normal, vHalfVec), 0.0), 128.0);
	vec3 specular = vec3(0.9, 0.9, 0.9) * sNdotL;
	
    vec3 color = ambiente + diffuse + specular; 
	
	gl_FragColor = vec4(color, 1.0);
}