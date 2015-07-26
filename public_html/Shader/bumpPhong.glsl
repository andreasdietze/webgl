this.bumpVSS1 = // init Attributes
            "attribute vec3 position;\n" +
            "attribute vec2 texCoords;\n" +
            "attribute vec3 normal;\n" +
            
            // init Uniforms
            "uniform vec3 translation;\n" +
            "uniform mat4 transformation;\n" +
            "uniform mat4 normalMat;\n" +
            "uniform mat4 modelViewMat;\n" +
            "uniform mat4 viewMat;\n" +
            
            // init Varyings
            "varying vec3 vPosition;\n" +
            "varying vec2 vTexCoords;\n" +
            "varying vec3 vNormal;\n" +
            "varying vec3 lightVec;\n" +
            "varying vec3 eyeVec;\n" +
            
            "void main() {\n" +
            "   vPosition = (modelViewMat * vec4(position, 1.0)).xyz;\n" +
            "   vNormal   = (normalMat * vec4(normal, 0.0)).xyz;\n" +
            "   vTexCoords = texCoords;\n" +
            
            "   vec3 n = normalize((normalMat * vec4(normal, 0.0)).xyz);\n" +
            "   vec3 t = normalize((normalMat * vec4(1.0, 0.0, 0.0, 0.0)).xyz);\n" +
            "   vec3 b = cross(n, t);\n" +
            
           // "   vec3 tmpVec = vec3(vec3(-1.0, 0.0, -1.0) - vPosition);\n" +
           "    vec3 tmpVec = normalize((viewMat * vec4(-1.0, 0.0, -1.0, 0.0)).xyz);\n" +
            
            "   lightVec.x = dot(tmpVec, t);\n" +
            "   lightVec.y = dot(tmpVec, b);\n" +
            "   lightVec.z = dot(tmpVec, n);\n" +
            
            "   tmpVec = -vPosition;\n" +
            "   eyeVec.x = dot(tmpVec, t);\n" +
            "   eyeVec.y = dot(tmpVec, b);\n" +
            "   eyeVec.z = dot(tmpVec, n);\n" +
            
            "   gl_Position = transformation * vec4(position, 1.0);\n" +
            "}\n";
    
    this.bumpFSS1 = this.prea +
            "uniform mat4 viewMat;\n" +
            "uniform mat4 normalMat;\n" +

            // Material
            "uniform sampler2D tex;\n" +
            "uniform sampler2D bumpMap;\n" +
            "uniform int texTrue;\n" +
            "uniform vec3 Ka;\n" +
            "uniform vec3 Kd;\n" +
            "uniform vec3 Ks;\n" +
            "uniform vec3 Ke;\n" +
            
            // Lighting
            "uniform int lighting;\n" +
            "uniform vec3 ambientColor;\n" +
            "uniform vec3 lightColor;\n" +
            "uniform vec3 specularColor;\n" +
            "uniform float shininess;\n" +
            "uniform float diffIntensity;\n" +
            "uniform float specIntensity;\n" +
            
            // Varyings
            "varying vec3 vPosition;\n" +
            "varying vec2 vTexCoords;\n " +
            "varying vec3 vNormal;\n" +
            "varying vec3 lightVec;\n" +
            "varying vec3 eyeVec;\n" +
            
            "void main() {\n" +
            "   // colors \n" +
            "   vec3 diffuseColor = vec3(1.0, 1.0, 1.0);\n" +
            "   float disSqr = dot(lightVec, lightVec);\n" +
            //"   float att = clamp(0.5 * sqrt(distSqr), 0.0, 1.0);\n" +
            "   float att = 0.9;\n" +
            //"   vec3 lVec = lightVec * inversesqrt(distSqr);\n" +
            "   vec3 lVec = lightVec * disSqr;\n" +
            
            "   vec3 vVec = normalize(eyeVec);\n" +
            "   vec3 base = vec3(texture2D(tex, vTexCoords));\n" +
            "   vec3 bump = normalize(texture2D(bumpMap, vTexCoords).xyz * 2.0 - 1.0);\n" +
            "   vec3 vAmbient = ambientColor;\n" +
            "   float diffuse = max(dot(-lVec, bump), 0.0);\n" +
            "   vec3 vDiffuse = diffuseColor * lightColor * diffuse;\n" +
            "   float specular = pow(clamp(dot(reflect(-lVec, bump), vVec), 0.0, 1.0), shininess);\n" +
            "   vec3 vSpecular = specularColor * specular;\n" +

            "   gl_FragColor = vec4((vAmbient + vDiffuse * base * diffIntensity + vSpecular * specIntensity) * att , 1.0);\n" +// (vAmbient * base + vDiffuse * base + vSpecular) * att;\n" +
                  
            "}\n"; 
    
    this.bumpVSS = // init Attributes
            "attribute vec3 position;\n" +
            "attribute vec2 texCoords;\n" +
            "attribute vec3 normal;\n" +
            
            // init Uniforms
            "uniform vec3 translation;\n" +
            "uniform mat4 transformation;\n" +
            "uniform mat4 normalMat;\n" +
            "uniform mat4 modelViewMat;\n" +
            
            // init Varyings
            "varying vec3 vPosition;\n" +
            "varying vec2 vTexCoords;\n" +
            "varying vec3 vNormal;\n" +
            //"varying vec3 vLightDirection;\n" +
            "varying mat3 vTBN;\n" +
            
            "void main() {\n" +
            "   vPosition = (modelViewMat * vec4(position, 1.0)).xyz;\n" +
            "   vNormal   = (normalMat * vec4(normal, 0.0)).xyz;\n" +
            "   vTexCoords = texCoords;\n" +
            
            // bump stuff
            "   vec3 tangent = vec3(1.0, 0.0, 0.0);\n" +
            "   vec3 binormal = cross(tangent, vNormal);\n" +
            "   vTBN = mat3(tangent, binormal, vNormal);\n" +
            
            "   gl_Position = transformation * vec4(position, 1.0);\n" +
            "}\n";
    
    this.bumpFSS = this.prea +
            "uniform mat4 viewMat;\n" +
            "uniform mat4 normalMat;\n" +

            // Material
            "uniform sampler2D tex;\n" +
            "uniform sampler2D bumpMap;\n" +
            "uniform int texTrue;\n" +
            "uniform vec3 Ka;\n" +
            "uniform vec3 Kd;\n" +
            "uniform vec3 Ks;\n" +
            "uniform vec3 Ke;\n" +
            
            // Lighting
            "uniform int lighting;\n" +
            "uniform vec3 ambientColor;\n" +
            "uniform vec3 lightColor;\n" +
            "uniform vec3 specularColor;\n" +
            "uniform float shininess;\n" +
            "uniform float diffIntensity;\n" +
            "uniform float specIntensity;\n" +
            
            // Varyings
            "varying vec3 vPosition;\n" +
            "varying vec2 vTexCoords;\n " +
            "varying vec3 vNormal;\n" +
            "varying mat3 vTBN;\n" +
            
            "void main() {\n" +
            "   // colors \n" +
            "   vec3 diffuseColor = vec3(1.0, 1.0, 1.0);\n" +
            //"   vec3 lightDirection = (viewMat * vec4(-1.0, 0.0, -1.0, 0.0)).xyz;\n" +
            "   vec3 lightDirection= (vTBN * vec3(-1.0, 0.0, -1.0));\n" +
            
            "   vec3 light = normalize(-lightDirection);\n" +
            "   vec3 view = normalize(-vPosition);\n" +
            "   vec3 normal = normalize(vNormal);\n" +
            "   vec3 halfVec = normalize(light + view);\n" +
            
            //Get the color of the texture
            "   vec3 bumpNorm = vec3(texture2D(bumpMap, vTexCoords));\n" +
            "   bumpNorm = (bumpNorm - 0.5) * 2.0;\n" + 
    
            "   vec3 color = vec3(0.0);\n" +
            "   float NdotL = 0.0;\n" +
            
            "   if(lighting == 1){\n" +
            "   float NdotL = max(dot(normal, view), 0.0);\n" +
            "   color = ambientColor + (diffuseColor * NdotL * lightColor) * diffIntensity + (pow(NdotL, shininess) * specularColor) * specIntensity;\n" +
            "   }\n" +
           
            " if(lighting == 0){\n" +
            "   // Diffuser Anteil \n" +
            "   NdotL = max(dot(bumpNorm, light), 0.0);\n" +
            "   vec3 diffuse = (diffuseColor * NdotL * lightColor) * diffIntensity;\n" +
            
            "   // Specularer Anteil \n" + 
            "   float powNdotH = pow(max(dot(normal, halfVec), 0.0), shininess);\n" +
            "   vec3 specular = (specularColor * powNdotH) * specIntensity;\n" + 
            
            "   // Finale Farbe \n" +
            "    color = ambientColor + diffuse + specular;\n" +
            "   }\n" +
            
            "   if(texTrue == 0)\n" +
            "       gl_FragColor = vec4(color, 1.0);\n" +
            
            "   if(texTrue == 1)\n" +
            "       gl_FragColor = texture2D(tex, vTexCoords) * vec4(color, 1.0);\n" +
                  
            "}\n"; 