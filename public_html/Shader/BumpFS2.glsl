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

	//vec3 view = normalize(-vPosition);
	
	//vec3 lightVec = vec3(0.0, 0.0, 1.5);
	
	// Determine where the light is positioned (this can be set however you like)
	//vec3 light = (normalMat * vec4(-lightVec, 0.0)).xyz;  // normalMat
    //light = normalize(-light);
	
	//vec3 halfVec = (view + light);
	
	// Extract the normal from the normal map
    vec3 normal = normalize(texture2D(bumpMap, vTexCoords).rgb * 2.0 - 1.0);
	//normal = (normalMat * vec4(normal, 0.0)).xyz;

    vec3 ambiente = vec3(0.1, 0.1, 0.1);
     
	// Calculate the lighting diffuse value
	float NdotL = max(dot(normal, -vLightVec), 0.0);
	vec3 diffuse = texture2D(tex, vTexCoords).rgb * NdotL * vec3(0.9, 0.9, 0.9);
	
	float sNdotL = pow(max(dot(normal, vHalfVec), 0.0), 128.0);
	vec3 specular = vec3(0.9, 0.9, 0.9) * sNdotL;
	

	//vec3 color = diffuse * texture2D(tex, vTexCoords).rgb; //+ specular;
     vec3 color = ambiente + diffuse + specular; 
	 
	 
	// Set the output color of our current pixel
	gl_FragColor = vec4(color, 1.0);
	//gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}