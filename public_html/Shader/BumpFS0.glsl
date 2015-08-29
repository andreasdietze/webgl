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
varying mat3 vTBN;

void main() {
   // colors
   vec3 diffuseColor = vec3(1.0, 1.0, 1.0);
   // vec3 lightDirection = (viewMat * vec4(-1.0, 0.0, -1.0, 0.0)).xyz;
   vec3 lightDirection= (vTBN * vec3(-1.0, 0.0, -1.0)).xyz;
   vec3 eye = (vTBN * vPosition).xyz;

   vec3 light = normalize(-lightDirection);
   vec3 view = normalize(-eye); //(-vPosition);
   vec3 normal = normalize(vNormal);
   vec3 halfVec = normalize(light + view);
   

//Get the color of the texture
   vec3 bumpNorm = vec3(texture2D(bumpMap, vTexCoords));
   bumpNorm = (bumpNorm - 0.5) * 2.0;

   vec3 color = vec3(0.0);
   float NdotL = 0.0;
   
   if(lighting == 1){
   float NdotL = max(dot(bumpNorm, view), 0.0);
   color = ambientColor + (diffuseColor * NdotL * lightColor) * diffIntensity + (pow(NdotL, shininess) * specularColor) * specIntensity;
}

 if(lighting == 0){
   // Diffuser Anteil
   NdotL = max(dot(bumpNorm, light), 0.0);
   vec3 diffuse = (diffuseColor * NdotL * lightColor) * diffIntensity;

   // Specularer Anteil \n" + 
   float powNdotH = pow(max(dot(bumpNorm, halfVec), 0.0), shininess);
   vec3 specular = (specularColor * powNdotH) * specIntensity;

   // Finale Farbe 
    color = ambientColor + diffuse + specular;
   }

   if(texTrue == 0)
       gl_FragColor = vec4(color, 1.0);

   if(texTrue == 1)
       gl_FragColor = texture2D(tex, vTexCoords) * vec4(color, 1.0);
	  
}