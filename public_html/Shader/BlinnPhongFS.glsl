uniform mat4 viewMat;
uniform mat4 modelViewMat;

// Material
uniform sampler2D tex;
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
uniform vec4 lightPos;
uniform vec4 lightDir;
uniform vec4 spotLightPos;
uniform vec4 spotLightDir;
uniform vec4 lightPos0;

// Varyings
varying vec3 vPosition;
varying vec2 vTexCoords;
varying vec3 vNormal;

void main() {
	// colors 
	vec3 diffuseColor = vec3(1.0, 1.0, 1.0);
	vec3 lightDirection, light, view, halfVec, pointLightPos, normal, diffuse, specular, viewL0, pointLightPos0;
	vec3 color = vec3(0.0);
	float NdotL, dist, attenuation, powNdotH;

	// Directinal light
	if(lighting == 0)
	{
		lightDirection = (viewMat * lightDir).xyz;    //vec4(-1.0, 0.0, -1.0, 0.0)
		light = normalize(-lightDirection);
		view = normalize(-vPosition);  		
		halfVec = normalize(light + view);
	}

	// Head light
	if(lighting == 1)
	{
		lightDirection = (viewMat * lightDir).xyz;
		//light = normalize(-lightDirection);
		view = normalize(-vPosition);  
	}

	// Point light
	if(lighting == 2)
	{
		pointLightPos = (viewMat * lightPos).xyz;   // * vec4(0.0, 0.0, 1.0, 1.0)
		view = normalize(pointLightPos - vPosition);
		
		pointLightPos0 = (viewMat * lightPos0).xyz;   // * vec4(0.0, 0.0, 1.0, 1.0)
		viewL0 = normalize(pointLightPos0 - vPosition);
	}
	
	// Spot light
	if(lighting == 3)
	{
		lightDirection = (viewMat * spotLightDir).xyz; // vec4(0.0, -1.0, 0.0, 0.0)
		//light = normalize(-lightDirection);
		pointLightPos = (viewMat * spotLightPos).xyz;  // vec4(0.0, 3.0, 0.0, 1.0)
		view = normalize(pointLightPos - vPosition);
	}
	
	normal = normalize(vNormal);

	// Directinal light
	if(lighting == 0){
		// Diffuser Anteil 
		NdotL = max(dot(normal, light), 0.0);
		diffuse = (diffuseColor * NdotL * lightColor) * diffIntensity;

		// Specularer Anteil 
		powNdotH = pow(max(dot(normal, halfVec), 0.0), shininess);
		specular = (specularColor * powNdotH) * specIntensity;

		// Finale Farbe 
		color = ambientColor + diffuse + specular;
	}
	
	// Head light
	if(lighting == 1)
	{
		NdotL = max(dot(normal, view), 0.0);	
		color = ambientColor + (diffuseColor * NdotL * lightColor) * diffIntensity + 
				(pow(NdotL, shininess) * specularColor) * specIntensity;
	}
	
	float NdotLL0;
	// Point Light
	if(lighting == 2)
	{
		dist = length(pointLightPos - lightDirection);
		attenuation = 0.4 + (3.0 * dist) + (20.0 * dist * dist); //1.0;// /  clamp(0.4 * sqrt(dist), 3.0, 20.0);
		NdotL = max(dot(normal, view), 0.0);	
		color = ambientColor + (diffuseColor * NdotL * lightColor) * diffIntensity + 
				((pow(NdotL, shininess) * specularColor) * specIntensity);// * attenuation;	
		NdotLL0 = max(dot(normal, viewL0), 0.0);
		color += (diffuseColor * NdotLL0 * lightColor) + 
				(pow(NdotLL0, shininess) * specularColor);
	}
	
	
	float sdl, intensity;
	
	// Spot light TODO
	// http://j.divided-games.com/dg-spotlight-c-glsl-webgl-javascript/
	if(lighting == 3)
	{
		sdl = dot(view, pointLightPos);
		// clamp((slCosCutoff[i] - SdL) / (slCosCutoff[i] - slCosCutoffInner[i]), 0.0, 1.0);
		intensity = clamp((10.5 - sdl) / (10.5 - 0.2), 0.0, 1.0);
		NdotL = max(dot(normal, view), 0.0);	
		color = ambientColor + (diffuseColor * NdotL * (lightColor * intensity)) * diffIntensity + 
				(pow(NdotL, shininess) * specularColor) * specIntensity;
	}

	if(texTrue == 0)
		gl_FragColor = vec4(color, 1.0);

	if(texTrue == 1)
		gl_FragColor = texture2D(tex, vTexCoords) * vec4(color, 1.0);
}