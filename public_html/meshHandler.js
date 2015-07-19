/* global VecMath */

"use strict";

var MeshHandler = function () {
    this.vss = "";
    this.fss = "";
    this.mesh = null;
    
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

};

MeshHandler.prototype.setupHouse = function () {
    // Vertex shader string
    this.vss = this.colorVSS;

    // Fragment shader string
    this.fss = this.colorFSS;

    // Setup triangle vertices
    this.mesh = {
        // Setup vetices
        vertices: [
            // tris behind
            -0.72, 0.2, 0,
            0.72, 0.2, 0,
            0, 0.82, 0,
            // quad  behind (indexed but double vertices for colors)
            -0.72, 0.2, 0,
            0.72, 0.2, 0,
            -0.72, -0.72, 0,
            0.72, -0.72, 0,
            // tris
            -0.7, 0.2, 0,
            0.7, 0.2, 0,
            0, 0.8, 0,
            // quad
            -0.7, 0.2, 0,
            0.7, 0.2, 0,
            -0.7, -0.7, 0,
            0.7, -0.7, 0
        ],
        // Setup vertex colors
        col: [
            // tris behind
            0, 0.7, 0.8,
            0, 0.7, 0.8,
            0, 0.7, 0.8,
            // quad behind (double vertex for colors)
            0, 0.7, 0.8,
            0, 0.7, 0.8,
            0, 0.7, 0.8,
            0, 0.7, 0.8,
            // tris 
            0.6, 0, 0,
            0.6, 0, 0,
            0.6, 0, 0,
            // quad
            0.9, 0.9, 0.5,
            0.9, 0.9, 0.5,
            0.9, 0.9, 0.5,
            0.9, 0.9, 0.5
        ],
        // Setup indices
        indices: [
            // tris behind
            0, 1, 2,
            // quad behind
            5, 4, 3,
            5, 6, 4,
            // tris 
            7, 8, 9,
            // quad
            12, 11, 10,
            12, 13, 11
        ],
        // Setup translation
        trans: {x: 0, y: 0, z: 0}
    };
    this.mesh.cosA = 1.0;
    this.mesh.sinA = 0.0;
};

MeshHandler.prototype.setupSecPointer = function () {
    // Vertex shader string
    this.vss = this.colorVSS;

    // Fragment shader string
    this.fss = this.colorFSS;

    // Setup triangle vertices
    this.mesh = {
        vertices: [
            // tris
            -0.01, 0.1, 0,
            0.01, 0.1, 0,
            0, 0.22, 0,
            // quad
            -0.005, 0.1, 0,
            0.005, 0.1, 0,
            -0.005, 0.0, 0,
            0.005, 0.0, 0
        ],
        col: [
            // tris
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            // quad
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0
        ],
        indices: [
            // tris
            0, 1, 2,
            // quad
            5, 4, 3,
            5, 6, 4
        ],
        trans: {x: 0.0, y: 0.0, z: 0.0}
    };
    
    // Model-space / world-space / object-space
    this.mesh.transformMatrix = VecMath.SFMatrix4f.identity();
};

MeshHandler.prototype.setupMinPointer = function () {
    // Vertex shader string
    this.vss = this.colorVSS;

    // Fragment shader string
    this.fss = this.colorFSS;

    // Setup triangle vertices
    this.mesh = {
        vertices: [
            // tris
            -0.01, 0.1, 0,
            0.01, 0.1, 0,
            0, 0.185, 0,
            // quad
            -0.005, 0.1, 0,
            0.005, 0.1, 0,
            -0.005, 0.0, 0,
            0.005, 0.0, 0
        ],
        col: [
            // tris
            1, 1, 0,
            1, 1, 0,
            1, 1, 0,
            // quad
            1, 1, 0,
            1, 1, 0,
            1, 1, 0,
            1, 1, 0
        ],
        indices: [
            // tris
            0, 1, 2,
            // quad
            5, 4, 3,
            5, 6, 4
        ],
        trans: {x: 0.0, y: 0.0, z: 0.0}
    };
    
    // Model-space / world-space / object-space
    this.mesh.transformMatrix = VecMath.SFMatrix4f.identity();
};

MeshHandler.prototype.setupHourPointer = function () {
    // Vertex shader string
    this.vss = this.colorVSS;

    // Fragment shader string
    this.fss = this.colorFSS;

    // Setup triangle vertices
    this.mesh = {
        vertices: [
            // tris
            -0.01, 0.1, 0,
            0.01, 0.1, 0,
            0, 0.15, 0,
            // quad
            -0.005, 0.1, 0,
            0.005, 0.1, 0,
            -0.005, 0.0, 0,
            0.005, 0.0, 0
        ],
        col: [
            // tris
            0, 0, 0,
            0, 0, 0,
            0, 0, 0,
            // quad
            0, 0, 0,
            0, 0, 0,
            0, 0, 0,
            0, 0, 0
        ],
        indices: [
            // tris
            0, 1, 2,
            // quad
            5, 4, 3,
            5, 6, 4
        ],
        trans: {x: -0.69, y: 0.651, z: 0}
    };
    
    // Model-space / world-space / object-space
    this.mesh.transformMatrix = VecMath.SFMatrix4f.identity();
};

MeshHandler.prototype.setupClock = function () {
    // Vertex shader string
    this.vss = this.texVSS;

    // Fragment shader string
    this.fss = this.texFSS;

    // Setup triangle vertices
    this.mesh = {
        // Setup vetices
        vertices: [
            -0.5, 0.5, 0,
            -0.5, -0.5, 0,
            0.5, -0.5, 0,
            0.5, 0.5, 0
        ],
        // Setup texture coords
        tex: [
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0
        ],
        // Setup indices
        indices: [
            // tris behind
            0, 1, 2,
            2, 3, 0
        ],
        // Setup translation
        trans: {x: 0, y: 0, z: 0}
    };
    
    // Model-space / world-space / object-space
    this.mesh.transformMatrix = VecMath.SFMatrix4f.identity();
};

MeshHandler.prototype.setupBox = function (size) {
    // Vertex shader string
    this.vss = this.colorAmbienteVSS;

    // Fragment shader string
    this.fss = this.colorAmbienteFSS;

    // Setup triangle vertices
    this.mesh = {
        vertices: [
            // front
            -size, -size, size, // P0
            size, -size, size, // P1
            size, size, size, // P2
            -size, size, size, // P3
            // back
            -size, -size, -size, // P4
            size, -size, -size, // P5
            size, size, -size, // P6
            -size, size, -size // P7
        ],
        col: [
            // front
            0, 0, 1,
            0, 0, 1,
            0, 1, 1,
            0, 1, 1,
            // back
            0, 1, 1,
            0, 1, 1,
            0, 0, 1,
            0, 0, 1
        ],
        indices: [
            // front
            0, 2, 3, 
            0, 1, 2, 
            // rigth
            1, 6, 2,
            1, 5, 6,
            // back
            5, 7, 6,
            5, 4, 7,
            // left
            4, 3, 7,
            4, 0, 3,
            // top
            3, 6, 7,
            3, 2, 6,
            // bottom
            4, 1, 0,
            4, 5, 1
        ],
        trans: {x: 0, y: 0, z: 0}
    };

    // Model-space / world-space / object-space
    this.mesh.transformMatrix = VecMath.SFMatrix4f.identity();
};

MeshHandler.prototype.setupBox6c = function (size) {
    // Vertex shader string
    this.vss = this.colorAmbienteVSS;

    // Fragment shader string
    this.fss = this.colorAmbienteFSS;
    
    // Setup triangle vertices
    this.mesh = {
        vertices: [
            // front
            -size, -size, size, // P0
            size, -size, size, // P1
            size, size, size, // P2
            -size, size, size, // P3
            // back
            -size, -size, -size, // P4
            size, -size, -size, // P5
            size, size, -size, // P6
            -size, size, -size // P7
        ],
        col: [
            // front
            0.6, 0.6, 0.6,
            0.6, 0.6, 0.6,
            0.6, 0.6, 0.6,
            0.6, 0.6, 0.6,
            // back
            0.2, 0.2, 0.2,
            0.2, 0.2, 0.2,
            0.2, 0.2, 0.2,
            0.2, 0.2, 0.2
        ],
        indices: [
            // front
            0, 2, 3, 
            0, 1, 2, 
            // rigth
            1, 6, 2,
            1, 5, 6,
            // back
            5, 7, 6,
            5, 4, 7,
            // left
            4, 3, 7,
            4, 0, 3,
            // top
            3, 6, 7,
            3, 2, 6,
            // bottom
            4, 1, 0,
            4, 5, 1
        ],
        trans: {x: 0, y: 0, z: 0}
    };
    
    // Model-space / world-space / object-space
    this.mesh.transformMatrix = VecMath.SFMatrix4f.identity();
};

MeshHandler.prototype.setupSphere = function (radius, colorMode) {
    this.vss = this.colorVSS;

    // Fragment shader string
    this.fss = this.colorFSS;

    var latitudeBands = 30;
    var longitudeBands = 30;

    var verts = [];
    var cols = [];
    var inds = [];

    for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
        var theta = latNumber * 2 * Math.PI / longitudeBands;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);

        for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
            var phi = longNumber * 2 * Math.PI / longitudeBands;
            var sinPhi = Math.sin(phi);
            var cosPhi = Math.cos(phi);

            var x = cosPhi * sinTheta;
            var y = cosTheta;
            var z = sinPhi * sinTheta;
            var r = 1, g = 0, b = 1;

            if(longNumber > longitudeBands / 2)
            {
                if(colorMode === 0){
                    if (longNumber % 2 === 0 && latNumber % 2 === 0) {
                        r = 1;
                        g = 1;
                        b = 0;
                    }
                } 
                else if(colorMode === 1){
                    if(longNumber % 2 === 0 || latNumber % 2 === 0){
                        r = 1;
                        g = 1;
                        b = 0;
                    }
                }
                else if(colorMode === 2){
                        if(longNumber % 2 === 1){ // latNumber % 2 === 1
                        r = 1;
                        g = 1;
                        b = 0;
                    }      
                }
                else if(colorMode === 3){
                        if(longNumber % 3 === 0){ // latNumber % 2 === 1
                        r = 0;
                        g = 1;
                        b = 0;
                    }      
                }
            }
            else{
                if(colorMode === 0){
                    if (longNumber % 2 === 0) {
                        r = 0;
                        g = 1;
                        b = 1;
                    }
                } 
                else if(colorMode === 1){
                    if(longNumber % 2 === 0){
                        r = 0;
                        g = 1;
                        b = 1;
                    }
                }
                else if(colorMode === 2){
                        if(longNumber % 2 === 1){ // latNumber % 2 === 1
                        r = 0;
                        g = 1;
                        b = 1;
                    }      
                }
                else if(colorMode === 3){
                        if(longNumber % 3 === 0){ // latNumber % 2 === 1
                        r = 0;
                        g = 1;
                        b = 0;
                    }      
                }
            }
                

            verts.push(x * radius);
            verts.push(y * radius);
            verts.push(z * radius);
            cols.push(r);
            cols.push(g);
            cols.push(b);

        }
    }

    for (var latNumber = 0; latNumber < latitudeBands; latNumber++) {
        for (var longNumber = 0; longNumber < longitudeBands; longNumber++) {
            var first = (latNumber * (longitudeBands + 1)) + longNumber;
            var second = first + longitudeBands + 1;
            inds.push(first);
            inds.push(second);
            inds.push(first + 1);

            inds.push(second);
            inds.push(second + 1);
            inds.push(first + 1);
        }
    }

    // Setup triangle vertices
    this.mesh = {
        vertices: verts,
        col: cols,
        indices: inds,
        trans: {x: 0, y: 0, z: 0}
    };
    
    // Model-space / world-space / object-space
    this.mesh.transformMatrix = VecMath.SFMatrix4f.identity();
};

MeshHandler.prototype.setupTexturedHouse = function () {
    // Vertex shader string
    this.vss = this.texVSS;
    
    // Fragment shader string
    this.fss = this.texFSS;

    // Setup triangle vertices
    this.mesh = {
        // Setup vetices
        vertices: [
            // tris behind
            -0.72, 0.2, 0,
            0.72, 0.2, 0,
            0, 0.82, 0,
            // quad  behind (indexed but double vertices for colors)
            -0.72, 0.2, 0,
            0.72, 0.2, 0,
            -0.72, -0.72, 0,
            0.72, -0.72, 0,
            // tris
            -0.7, 0.2, 0,
            0.7, 0.2, 0,
            0, 0.8, 0,
            // quad
            -0.7, 0.2, 0,
            0.7, 0.2, 0,
            -0.7, -0.7, 0,
            0.7, -0.7, 0
        ],
        // Setup texture coords
        tex: [
            // tris behind
            0.0, 0.0,
            1.0, 0.0,
            0.5, 1.0,
            // quad behind (double vertex for colors)
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // tris 
            0.0, 0.0,
            1.0, 0.0,
            0.5, 1.0,
            // quad
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0
        ],
        // Setup indices
        indices: [
            // tris behind
            0, 1, 2,
            // quad behind
            5, 4, 3,
            5, 6, 4,
            // tris 
            7, 8, 9,
            // quad
            12, 11, 10,
            12, 13, 11
        ],
        // Setup translation
        trans: {x: 0, y: 0, z: 0}
    };
    
    // Model-space / world-space / object-space
    this.mesh.transformMatrix = VecMath.SFMatrix4f.identity();
};

MeshHandler.prototype.setupTexturedBox = function (size) {
    // Vertex shader string
    this.vss = this.texVSS;

    // Fragment shader string
    this.fss = this.texFSS;

    // Setup triangle vertices
    this.mesh = {
        vertices: [
            // front
            -size, -size, size, // P0
            size, -size, size, // P1
            size, size, size, // P2
            -size, size, size, // P3
            // back
            -size, -size, -size, // P4
            size, -size, -size, // P5
            size, size, -size, // P6
            -size, size, -size // P7
        ],
        tex: [
            // vorne
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // hinten
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // oben
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // unten
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // rechts
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // links
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0
        ],
        indices: [
            // front
            0, 2, 3, 
            0, 1, 2, 
            // rigth
            1, 6, 2,
            1, 5, 6,
            // back
            5, 7, 6,
            5, 4, 7,
            // left
            4, 3, 7,
            4, 0, 3,
            // top
            3, 6, 7,
            3, 2, 6,
            // bottom
            4, 1, 0,
            4, 5, 1
        ],
        trans: {x: 0, y: 0, z: 0}
    };
    
    // Model-space / world-space / object-space
    this.mesh.transformMatrix = VecMath.SFMatrix4f.identity();
};

MeshHandler.prototype.setupTexturedBox6f = function () {
    // Vertex shader string
    this.vss = this.texVSS;

    // Fragment shader string
    this.fss = this.texFSS;

    // Setup triangle vertices
    this.mesh = {
        vertices: [
            // Front face
            -1.0, -1.0,  1.0,
             1.0, -1.0,  1.0,
             1.0,  1.0,  1.0,
            -1.0,  1.0,  1.0,

            // Back face
            -1.0, -1.0, -1.0,
            -1.0,  1.0, -1.0,
             1.0,  1.0, -1.0,
             1.0, -1.0, -1.0,

            // Top face
            -1.0,  1.0, -1.0,
            -1.0,  1.0,  1.0,
             1.0,  1.0,  1.0,
             1.0,  1.0, -1.0,

            // Bottom face
            -1.0, -1.0, -1.0,
             1.0, -1.0, -1.0,
             1.0, -1.0,  1.0,
            -1.0, -1.0,  1.0,

            // Right face
             1.0, -1.0, -1.0,
             1.0,  1.0, -1.0,
             1.0,  1.0,  1.0,
             1.0, -1.0,  1.0,

            // Left face
            -1.0, -1.0, -1.0,
            -1.0, -1.0,  1.0,
            -1.0,  1.0,  1.0,
            -1.0,  1.0, -1.0
        ],
        tex: [
            // vorne
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // hinten
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // oben
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // unten
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // rechts
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // links
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0
        ],
        indices: [
            0, 1, 2,      0, 2, 3,    // Front face
            4, 5, 6,      4, 6, 7,    // Back face
            8, 9, 10,     8, 10, 11,  // Top face
            12, 13, 14,   12, 14, 15, // Bottom face
            16, 17, 18,   16, 18, 19, // Right face
            20, 21, 22,   20, 22, 23  // Left face
        ],
        // Setup translation
        trans: {x: 0, y: 0, z: 0}      
    };

    // Model-space / world-space / object-space
    this.mesh.transformMatrix = VecMath.SFMatrix4f.identity();
};

MeshHandler.prototype.setupTexturedSphere = function (radius) {
    // Vertex shader string
    this.vss = this.texVSS;

    // Fragment shader string
    this.fss = this.texFSS;

    var latitudeBands = 30;
    var longitudeBands = 30;

    var verts = [];
    var tex = [];
    var inds = [];

    for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
        var theta = latNumber * 2 * Math.PI / longitudeBands;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);

        for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
            var phi = longNumber * 2 * Math.PI / longitudeBands;
            var sinPhi = Math.sin(phi);
            var cosPhi = Math.cos(phi);

            var x = cosPhi * sinTheta;
            var y = cosTheta;
            var z = sinPhi * sinTheta;
            var u = 1 - (longNumber / longitudeBands);
            var v = 1 - (latNumber / latitudeBands);

            verts.push(x * radius);
            verts.push(y * radius);
            verts.push(z * radius);
            tex.push(u);
            tex.push(v);

        }
    }

    for (var latNumber = 0; latNumber < latitudeBands; latNumber++) {
        for (var longNumber = 0; longNumber < longitudeBands; longNumber++) {
            var first = (latNumber * (longitudeBands + 1)) + longNumber;
            var second = first + longitudeBands + 1;
            inds.push(first);
            inds.push(second);
            inds.push(first + 1);

            inds.push(second);
            inds.push(second + 1);
            inds.push(first + 1);
        }
    }

    // Setup triangle vertices
    this.mesh = {
        vertices: verts,
        tex: tex,
        indices: inds,
        trans: {x: 0, y: 0, z: 0}
    };
    
    // Model-space / world-space / object-space
    this.mesh.transformMatrix = VecMath.SFMatrix4f.identity();
};

MeshHandler.prototype.setupTexturedLightSphere = function (radius) {
    // Vertex shader string
    this.vss = this.blinnPhongVSS;

    // Fragment shader string
    this.fss = this.blinnPhongFSS;
    
    var latitudeBands = 30;
    var longitudeBands = 30;

    var verts = [];
    var tex = [];
    var inds = [];
    var normals = [];

    for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
        var theta = latNumber * 2 * Math.PI / longitudeBands;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);

        for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
            var phi = longNumber * 2 * Math.PI / longitudeBands;
            var sinPhi = Math.sin(phi);
            var cosPhi = Math.cos(phi);

            var x = cosPhi * sinTheta;
            var y = cosTheta;
            var z = sinPhi * sinTheta;
            var u = 1 - (longNumber / longitudeBands);
            var v = 1 - (latNumber / latitudeBands);

            verts.push(x * radius);
            verts.push(y * radius);
            verts.push(z * radius);
            tex.push(u);
            tex.push(v);
            normals.push(x);
            normals.push(y);
            normals.push(z);

        }
    }

    for (var latNumber = 0; latNumber < latitudeBands; latNumber++) {
        for (var longNumber = 0; longNumber < longitudeBands; longNumber++) {
            var first = (latNumber * (longitudeBands + 1)) + longNumber;
            var second = first + longitudeBands + 1;
            inds.push(first);
            inds.push(second);
            inds.push(first + 1);

            inds.push(second);
            inds.push(second + 1);
            inds.push(first + 1);
        }
    }

    // Setup triangle vertices
    this.mesh = {
        vertices: verts,
        tex: tex,
        normals:normals,
        indices: inds,
        trans: {x: 0, y: 0, z: 0}
    };
    
    // Model-space / world-space / object-space
    this.mesh.transformMatrix = VecMath.SFMatrix4f.identity();
};

// OBJ -------------------------------------------------------------------------------

MeshHandler.prototype.loadOBJ = function (fileName, scaleFac) {
    // Vertex shader string
    this.vss = this.diffuseLightingVSS;

    // Fragment shader string
    this.fss = this.diffuseLightingFSS;

    var request = new XMLHttpRequest();
        request.open('GET', fileName, false);
        request.send();  

    if (fileName.toLowerCase().indexOf(".obj") > 0) {
        var objDoc = new OBJDoc(fileName);

        // parse parameters: file string, scale, reverse normals
        if (!objDoc.parse(request.responseText, scaleFac, true)) {
            console.error("OBJ file parsing error: " + fileName);
            return;
        }

        var geo = objDoc.getDrawingInfo();
        this.mesh = setOBJ(geo);
    }
};

MeshHandler.prototype.loadOBJSpec = function (fileName, scaleFac) {
    // Vertex shader string
    this.vss = this.blinnPhongVSS;
            
    // Fragment shader string
    this.fss = this.blinnPhongFSS;
    
    var request = new XMLHttpRequest();
        request.open('GET', fileName, false);
        request.send();  
        
    //var that = this;
    //request.onload = function(that){

        if (fileName.toLowerCase().indexOf(".obj") > 0) {
            var objDoc = new OBJDoc(fileName);

            // parse parameters: file string, scale, reverse normals
            if (!objDoc.parse(request.responseText, scaleFac, true)) {
                console.error("OBJ file parsing error: " + fileName);
                return;
            }

            var geo = objDoc.getDrawingInfo();
            this.mesh = setOBJ(geo);
        }
    //};
};

function setOBJ(geo){
    //console.log("GEO" + geo.vertices);
    var mesh = {
        vertices: geo.positions,
        //colors: geo.colors,
        normals: geo.normals,
        indices: geo.indices,
        // Setup translation
        trans: {x: 0, y: 0, z: 0}      
    };
    
    // Model-space / world-space / object-space
    mesh.transformMatrix = VecMath.SFMatrix4f.identity();
    
    //mesh.transformMatrix = mesh.transformMatrix.mult(
      //      VecMath.SFMatrix4f.translation(new VecMath.SFVec3f(-5.0, 0.0, 0.0)));
    
    //console.log("MESH " + mesh.vertices);  
    return mesh;
}

// Tests -----------------------------------------------------------------------------

// https://developer.mozilla.org/de/docs/Web/WebGL/Beleuchtung_in_WebGL
MeshHandler.prototype.setupDiffusedBox = function () {
    this.prea = "#ifdef GL_FRAGMENT_PRECISION_HIGH\n" +
            "  precision highp float;\n" +
            "#else\n" +
            "  precision mediump float;\n" +
            "#endif\n\n";

    this.vss =
            "// init Attributes \n" +
            "attribute vec3 position;\n" +
            "attribute vec3 normal;\n" +
            "attribute vec2 texCoords;\n" +
            
            "// init Uniforms \n" +
            "uniform vec3 translation;\n" +
            "uniform mat4 transformation;\n" +
            "uniform mat4 normalMat;\n" +
            
            "// init Varyings \n" +
            "varying vec2 vTexCoords;\n" +
            "varying vec3 vLighting;\n" +
            "varying vec3 vNormalCol;\n" + 
            
            "void main() {\n" +
            "   vTexCoords = texCoords;\n" +
            "   gl_Position = transformation * vec4(position, 1.0);\n" +
            
            "// set ambient color \n" +
            "   vec3 ambientLight = vec3(0.6, 0.6, 0.6);\n" +
            
            "// set light color \n" +
            "   vec3 directionalLightColor = vec3(0.5, 0.5, 0.75);\n" +
            
            "// set light direction \n" +
            "   vec3 directionalVector = vec3(0.0, 0.0, 1.0); //vec3(0.85, 0.8, 0.75);\n" +
            
            "// compute normalVector via viewMat * normal \n" +
            "   vec4 transformedNormal = normalMat * vec4(normal, 1.0);\n" +
            
            "// compute Lambert-Factor \n" +
            "   float lambert = max(dot(transformedNormal.xyz, directionalVector), 0.0);\n" +
            "   vLighting = ambientLight + (directionalLightColor * lambert);\n" +
            
            "   vNormalCol = normal;\n" +
            "}\n";

    // Fragment shader string
    this.fss = this.prea +
            "// Texture-Sampler for diffuse map \n" +
            "uniform sampler2D tex;\n" +
            
            "// forwarded texture coords \n" +
            "varying vec2 vTexCoords;\n" +
            
            "// forwarded diffuse lighting \n" +
            "varying vec3 vLighting;\n" +
                
            "varying vec3 vNormalCol;\n" + 
            
            "void main() {\n" +
            "   vec4 texelColor = texture2D(tex, vTexCoords);\n" +
            //" vec3 normal = (normalize(vNormalCol) + 1.0) / 2.0;\n" +
            "   gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);\n" +
            //"   gl_FragColor = vec4(normal, 1.0);\n" +
            "}\n";

    // Setup triangle vertices
    this.mesh = {
        vertices: [
            // Front face
            -1.0, -1.0,  1.0,
             1.0, -1.0,  1.0,
             1.0,  1.0,  1.0,
            -1.0,  1.0,  1.0,

            // Back face
            -1.0, -1.0, -1.0,
            -1.0,  1.0, -1.0,
             1.0,  1.0, -1.0,
             1.0, -1.0, -1.0,

            // Top face
            -1.0,  1.0, -1.0,
            -1.0,  1.0,  1.0,
             1.0,  1.0,  1.0,
             1.0,  1.0, -1.0,

            // Bottom face
            -1.0, -1.0, -1.0,
             1.0, -1.0, -1.0,
             1.0, -1.0,  1.0,
            -1.0, -1.0,  1.0,

            // Right face
             1.0, -1.0, -1.0,
             1.0,  1.0, -1.0,
             1.0,  1.0,  1.0,
             1.0, -1.0,  1.0,

            // Left face
            -1.0, -1.0, -1.0,
            -1.0, -1.0,  1.0,
            -1.0,  1.0,  1.0,
            -1.0,  1.0, -1.0
        ],
        tex: [
            // vorne
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // hinten
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // oben
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // unten
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // rechts
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // links
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0
        ],
        indices: [
            0, 1, 2,      0, 2, 3,    // Front face
            4, 5, 6,      4, 6, 7,    // Back face
            8, 9, 10,     8, 10, 11,  // Top face
            12, 13, 14,   12, 14, 15, // Bottom face
            16, 17, 18,   16, 18, 19, // Right face
            20, 21, 22,   20, 22, 23  // Left face
        ],
        // Setup translation
        trans: {x: 0, y: 0, z: 0}      
    };

    this.mesh.transformMatrix = VecMath.SFMatrix4f.identity();
};




