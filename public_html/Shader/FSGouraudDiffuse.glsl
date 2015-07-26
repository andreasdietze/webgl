 "varying vec3 vColor;\n" +
            
            "// forwarded diffuse lighting \n" +
            "varying vec3 vLighting;\n" +
                
            //"varying vec3 vNormalCol;\n" + 
            
            "void main() {\n" +
            "   vec4 texelColor = vec4(vColor, 1.0);\n" +
            //" vec3 normal = (normalize(vNormalCol) + 1.0) / 2.0;\n" +
            "   gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);\n" +
            //"   gl_FragColor = vec4(normal, 1.0);\n" +
            "}\n";