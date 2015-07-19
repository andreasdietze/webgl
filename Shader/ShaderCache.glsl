// Setup shader-cache  
    this.prea = "#ifdef GL_FRAGMENT_PRECISION_HIGH\n" +
            "  precision highp float;\n" +
            "#else\n" +
            "  precision mediump float;\n" +
            "#endif\n\n";
    
    this.colorVSS = "attribute vec3 position;\n" +
            "attribute vec3 color;\n" +
            "uniform mat4 transformation;\n" +
            "varying vec3 vColor;\n" +
            "void main() {\n" +
            "   gl_Position = transformation * vec4(position, 1.0);\n" +
            "   vColor = color;\n" +
            "}\n";
    
    this.colorFSS = this.prea +
            "varying vec3 vColor;\n" +
            "void main() {\n" +
            "   gl_FragColor = vec4(vColor, 1.0);\n" +
            "}\n";
    
    this.texVSS = "attribute vec3 position;\n" +
            "attribute vec2 texCoords;\n" +
            "uniform vec3 translation;\n" +
            "uniform mat4 transformation;\n" +
            "varying vec2 vTexCoords;\n" +
            "void main() {\n" +
            "   vTexCoords = texCoords;\n" +
            "   gl_Position = transformation * vec4(position, 1.0);\n" +
            "}\n";
    
    this.texFSS = this.prea +
            "uniform sampler2D tex;\n" +
            "varying vec2 vTexCoords;\n" +
            "void main() {\n" +
            "   gl_FragColor = texture2D(tex, vTexCoords);\n" +
            "}\n";
    
    this.colorAmbienteVSS = "attribute vec3 position;\n" +
            "attribute vec3 color;\n" +
            "uniform mat4 transformation;\n" +
            "varying vec3 vColor;\n" +
            "varying vec3 vAmbient;\n" +
            "void main() {\n" +
            "   vAmbient = vec3(0.8, 0.8, 0.8);\n" +
            "   gl_Position = transformation * vec4(position, 1.0);\n" +
            "   vColor = color;\n" +
            "}\n";
    
    this.colorAmbienteFSS = this.prea +
            "varying vec3 vColor;\n" +
            "varying vec3 vAmbient;\n" + 
            "void main() {\n" +
            "   gl_FragColor = vec4(vColor * vAmbient, 1.0);\n" +
            "}\n";
    
    this.diffuseLightingVSS = "// init Attributes \n" +
            "attribute vec3 position;\n" +
            "attribute vec3 normal;\n" +
            "attribute vec3 color;\n" +
            
            "// init Uniforms \n" +
            "uniform mat4 transformation;\n" +
            "uniform mat4 normalMat;\n" + 
            "uniform mat4 viewMat;\n" +
            
            "// init Varyings \n" +
            "varying vec3 vColor;\n" +
            "varying vec3 vLighting;\n" +
            
            "void main() {\n" +
            "   vColor =  vec3(0.7, 0.7, 0.3);\n" +
            "   gl_Position = transformation * vec4(position, 1.0);\n" +
            
            "// set ambient color \n" +
            "   vec3 ambientLight = vec3(0.3, 0.3, 0.3);\n" +
            
            "// set light color \n" +
            "   vec3 directionalLightColor = vec3(0.5, 0.5, 0.5);\n" +
            
            "// set light direction \n" +
            "   vec3 directionalVector = (viewMat * vec4(1.0, 0.0, 1.0, 0.0)).xyz; //vec3(0.85, 0.8, 0.75);\n" +
            
            "// compute normalVector via normalMat * normal \n" +
            "   vec4 transformedNormal = normalMat * vec4(normal, 1.0);\n" +
            
            "// compute Lambert-Factor \n" +
            "   float lambert = max(dot(transformedNormal.xyz, directionalVector), 0.0);\n" +
            "   vLighting = ambientLight + directionalLightColor * lambert;\n" +
            "}\n";
            
    this.diffuseLightingFSS = this.prea +
            "varying vec3 vColor;\n" +
            "// forwarded diffuse lighting \n" +
            "varying vec3 vLighting;\n" +  
            "void main() {\n" +
            "   vec4 texelColor = vec4(vColor, 1.0);\n" +
            "   gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);\n" +
            "}\n";  
            
    this.blinnPhongVSS = // init Attributes
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
            
            "void main() {\n" +
            "   vPosition = (modelViewMat * vec4(position, 1.0)).xyz;\n" +
            "   vNormal   = (normalMat * vec4(normal, 0.0)).xyz;\n" +
            "   vTexCoords = texCoords;\n" +
            "   gl_Position = transformation * vec4(position, 1.0);\n" +
            "}\n";
    
    this.blinnPhongFSS = this.prea +
            "uniform mat4 viewMat;\n" +

            // Material
            "uniform sampler2D tex;\n" +
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
            
            "void main() {\n" +
            "   // colors \n" +
            "   vec3 diffuseColor = vec3(1.0, 1.0, 1.0);\n" +
            "   vec3 lightDirection = (viewMat * vec4(-1.0, 0.0, -1.0, 0.0)).xyz;\n" +
            
            "   vec3 light = normalize(-lightDirection);\n" +
            "   vec3 view = normalize(-vPosition);\n" +
            "   vec3 normal = normalize(vNormal);\n" +
            "   vec3 halfVec = normalize(light + view);\n" +
    
            "   vec3 color = vec3(0.0);\n" +
            "   float NdotL = 0.0;\n" +
            
            "   if(lighting == 1){\n" +
            "   float NdotL = max(dot(normal, view), 0.0);\n" +
            "   color = ambientColor + diffuseColor * NdotL * lightColor + pow(NdotL, shininess) * specularColor;\n" +
            "   }\n" +
           
            " if(lighting == 0){\n" +
            "   // Diffuser Anteil \n" +
            "   NdotL = max(dot(normal, light), 0.0);\n" +
            "   vec3 diffuse = (diffuseColor * NdotL * lightColor) * diffIntensity;\n" +
            
            "   // Specularer Anteil \n" + 
            "   float powNdotH = pow(max(dot(normal, halfVec), 0.0), shininess);\n" +
            "   vec3 specular = (specularColor * powNdotH * lightColor) * specIntensity;\n" + 
            
            "   // Finale Farbe \n" +
            "    color = ambientColor + diffuse + specular;\n" +
            "   }\n" +
            
            "   if(texTrue == 0)\n" +
            "       gl_FragColor = vec4(color, 1.0);\n" +
            
            "   if(texTrue == 1)\n" +
            "       gl_FragColor = texture2D(tex, vTexCoords) * vec4(color, 1.0);\n" +
                  
            "}\n"; 