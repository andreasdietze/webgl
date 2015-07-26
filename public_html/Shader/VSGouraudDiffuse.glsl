"// init Attributes \n" +
            "attribute vec3 position;\n" +
            "attribute vec3 normal;\n" +
            "attribute vec3 color;\n" +
            
            "// init Uniforms \n" +
            "uniform vec3 translation;\n" +
            "uniform mat4 transformation;\n" +
            "uniform mat4 normalMat;\n" + 
            
            "// init Varyings \n" +
            "varying vec3 vColor;\n" +
            "varying vec3 vLighting;\n" +
            //"varying vec3 vNormalCol;\n" + 
            
            "void main() {\n" +
            "   vColor = vec3(0.7, 0.7, 0.3);\n" +
            "   gl_Position = transformation * vec4(position, 1.0);\n" +
            
            "// set ambient color \n" +
            "   vec3 ambientLight = vec3(0.6, 0.6, 0.6);\n" +
            
            "// set light color \n" +
            "   vec3 directionalLightColor = vec3(0.5, 0.5, 0.5);\n" +
            
            "// set light direction \n" +
            "   vec3 directionalVector = vec3(1.0, 0.0, -1.0); //vec3(0.85, 0.8, 0.75);\n" +
            
            "// compute normalVector via normalMat * normal \n" +
            "   vec4 transformedNormal = normalMat * vec4(normal, 1.0);\n" +
            
            "// compute Lambert-Factor \n" +
            "   float lambert = max(dot(transformedNormal.xyz, directionalVector), 0.0);\n" +
            "   vLighting = ambientLight + (directionalLightColor * lambert);\n" +
            
            //"   vNormalCol = normal;\n" +
            "}\n";