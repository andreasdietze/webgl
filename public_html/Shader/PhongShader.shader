this.prea = "#ifdef GL_FRAGMENT_PRECISION_HIGH\n" +
            "  precision highp float;\n" +
            "#else\n" +
            "  precision mediump float;\n" +
            "#endif\n\n";

    this.vss =
            "// init Attributes \n" +
            "attribute vec3 position;\n" +
            "attribute vec3 normal;\n" +
            
            "// init Uniforms \n" +
            "uniform vec3 translation;\n" +
            "uniform mat4 transformation;\n" +
            "uniform mat4 normalMat;\n" +
            "uniform mat4 modelViewMat;\n" +
            
            "// init Varyings \n" +
            "varying vec3 vPosition;\n" +
            "varying vec3 vNormal;\n" +
            
            "void main() {\n" +
            "   vPosition = (modelViewMat * vec4(position, 1.0)).xyz;\n" +
            "   vNormal   = (normalMat * vec4(normal, 0.0)).xyz;\n" +
            "   gl_Position = transformation * vec4(position, 1.0);\n" +
            "}\n";

    // Fragment shader string
    this.fss = this.prea +
            "varying vec3 vPosition;\n" +
            "varying vec3 vNormal;\n" +
            
            "void main() {\n" +
            "   // colors \n" +
            "   vec3 diffuseColor = vec3(0.0, 0.0, 1.0);\n" +
            "   vec3 specularColor = vec3(0.3, 0.3, 0.3);\n" +
            "   vec3 lightDirection = vec3(-1.0, 1.0, 1.0);\n" +
            
            "   vec3 light = normalize(-lightDirection);\n" +
            "   vec3 view = normalize(-vPosition);\n" +
            "   vec3 normal = normalize(vNormal);\n" +
            
            "   vec3 halfVec = normalize(light + view);\n" +
            "   vec3 lightColor = vec3(1.0, 1.0, 0.8);\n" +
            
            "   // Ambienter Anteil \n" +
            "   vec3 ambient = vec3(0.1);\n" +
            
            "   // Diffuser Anteil \n" +
            "   float NdotL = max(dot(normal, light), 0.0);\n" +
            "   vec3 diffuse = diffuseColor * NdotL * lightColor;\n" +
            
            "   // Specularer Anteil \n" + 
            "   float powNdotH = pow(max(dot(normal, halfVec), 0.0), 128.0);\n" +
            "   vec3 specular = specularColor * powNdotH * lightColor;\n" + 
            
            "   // Finale Farbe \n" +
            "   vec3 color = ambient + diffuse + specular;\n" + 
            "   gl_FragColor = vec4(color, 1.0);\n" +
           
           
            "}\n";