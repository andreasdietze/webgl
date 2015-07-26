            "uniform mat4 viewMat;\n" +
            "uniform sampler2D tex;\n" +
            "uniform int lighting;\n" +
            "varying vec3 vPosition;\n" +
            "varying vec2 vTexCoords;\n " +
            "varying vec3 vNormal;\n" +
            
            "void main() {\n" +
            "   // colors \n" +
            "   vec3 diffuseColor = vec3(1.0, 1.0, 1.0);\n" + //texture2D(tex, vTexCoords);\n
            "   vec3 specularColor = vec3(0.9, 0.9, 0.9);\n" +
            "   vec3 lightDirection = (viewMat * vec4(-1.0, 0.0, -1.0, 0.0)).xyz;\n" +
            
            "   vec3 light = normalize(-lightDirection);\n" +
            "   vec3 view = normalize(-vPosition);\n" +
            "   vec3 normal = normalize(vNormal);\n" +
            "   vec3 halfVec = normalize(light + view);\n" +
            
            "   vec3 lightColor = vec3(1.0, 1.0, 0.8);\n" +
            
            "   // Ambienter Anteil \n" +
            "   vec3 ambient = vec3(0.1);\n" +
            
            "   // Shininess\n" +
            "   float shininess = 128.0;\n" +
            
            "   vec3 color = vec3(0.0);\n" +
            "   float NdotL = 0.0;\n" +
            //"   #if 0\n" +
            "   if(lighting == 0){\n" +
            "   float NdotL = max(dot(normal, view), 0.0);\n" +
            "   color = ambient + NdotL * diffuseColor + pow(NdotL, shininess) * specularColor;\n" +
            "   }\n" +
            //"   #endif\n" +
           
            " if(lighting == 1){\n" +
            "   // Diffuser Anteil \n" +
            "   NdotL = max(dot(normal, light), 0.0);\n" +
            "   vec3 diffuse = diffuseColor * NdotL * lightColor;\n" +
            
            "   // Specularer Anteil \n" + 
            "   float powNdotH = pow(max(dot(normal, halfVec), 0.0), shininess);\n" +
            "   vec3 specular = specularColor * powNdotH * lightColor;\n" + 
            
            "   // Finale Farbe \n" +
            "    color = ambient + diffuse + specular;\n" +
            "   }\n" +
            
            "   gl_FragColor = texture2D(tex, vTexCoords) * vec4(color, 1.0);\n" +
                  
            "}\n";