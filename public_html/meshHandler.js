/* global VecMath, main */

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
    
    // Shader for colored objects without lighting
    this.colorVSS = loadStringFromFile("Shader/ColorVS.glsl");
    this.colorFSS = this.prea + loadStringFromFile("Shader/ColorFS.glsl");

    // Shader for textured object without lighting
    this.texVSS = loadStringFromFile("Shader/TextureVS.glsl");
    this.texFSS = this.prea + loadStringFromFile("Shader/TextureFS.glsl");
    
    // Shader for diffuse lighting
    this.diffuseLightingVSS = loadStringFromFile("Shader/DiffuseLightingVS.glsl");      
    this.diffuseLightingFSS = this.prea + loadStringFromFile("Shader/DiffuseLightingFS.glsl");
            
    // Shader for (blinn)phong lighting with and without color-tex       
    this.blinnPhongVSS = loadStringFromFile("Shader/BlinnPhongVS.glsl"); 
    this.blinnPhongFSS = this.prea + loadStringFromFile("Shader/BlinnPhongFS.glsl");
    
    // Bumpmap shader test2
    this.bumpVSS2 = loadStringFromFile("Shader/BumpVS2.glsl");
    this.bumpFSS2 = this.prea + loadStringFromFile("Shader/BumpFS2.glsl");
    
    // Bumpmap shader test1
    this.bumpVSS1 = loadStringFromFile("Shader/BumpVS1.glsl");
    this.bumpFSS1 = this.prea + loadStringFromFile("Shader/BumpFS1.glsl");
    
    // Bumpmap shader test0
    this.bumpVSS0 = loadStringFromFile("Shader/BumpVS0.glsl");
    this.bumpFSS0 = this.prea + loadStringFromFile("Shader/BumpFS0.glsl");
    
    // Deform-Shader
    this.deformVSS = loadStringFromFile("Shader/DeformVS.glsl");
    this.deformFSS = this.prea + loadStringFromFile("Shader/DeformFS.glsl");
    
    // RenderTarget
    this.rtVSS = loadStringFromFile("Shader/RTVS.glsl");
    this.rtFSS = this.prea + loadStringFromFile("Shader/RTFS.glsl");
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

MeshHandler.prototype.setupQuad = function (type) {
    
    if(type === 0){
        // Vertex shader string
        this.vss = this.bumpVSS1;

        // Fragment shader string
        this.fss = this.bumpFSS1;
    }
    else if (type === 1){
        // Vertex shader string
        this.vss = this.deformVSS;

        // Fragment shader string
        this.fss = this.deformFSS;
    }
    else if (type === 2){
        // Vertex shader string
        this.vss = this.texVSS;

        // Fragment shader string
        this.fss = this.texFSS;
    }
    


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
        // Setup normals
        normals: [
          0.0, 0.0, 1-0,
          0.0, 0.0, 1.0,
          0.0, 0.0, 1.0,
          0.0, 0.0, 1.0
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

MeshHandler.prototype.setupRenderTarget = function () {
    // Vertex shader string
    this.vss = this.rtVSS;

    // Fragment shader string
    this.fss = this.rtFSS;

    // Setup triangle vertices
    this.mesh = {
        // Setup vetices
        vertices: [
            -1.0, 1.0, 0,
            -1.0, -1.0, 0,
            1.0, -1.0, 0,
            1.0, 1.0, 0
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
    this.vss = this.colorVSS;

    // Fragment shader string
    this.fss = this.colorFSS;

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

MeshHandler.prototype.setupBumpBox = function () {
    // Vertex shader string
    this.vss = this.bumpVSS0;

    // Fragment shader string
    this.fss = this.bumpFSS0;

    // Setup triangle vertices
    this.mesh = {
        vertices: [
            // front
            -1.0, -1.0,  1.0,
             1.0, -1.0,  1.0,
             1.0,  1.0,  1.0,
            -1.0,  1.0,  1.0,

            // back
            -1.0, -1.0, -1.0,
            -1.0,  1.0, -1.0,
             1.0,  1.0, -1.0,
             1.0, -1.0, -1.0,

            // top
            -1.0,  1.0, -1.0,
            -1.0,  1.0,  1.0,
             1.0,  1.0,  1.0,
             1.0,  1.0, -1.0,

            // bottom
            -1.0, -1.0, -1.0,
             1.0, -1.0, -1.0,
             1.0, -1.0,  1.0,
            -1.0, -1.0,  1.0,

            // right
             1.0, -1.0, -1.0,
             1.0,  1.0, -1.0,
             1.0,  1.0,  1.0,
             1.0, -1.0,  1.0,

            // left
            -1.0, -1.0, -1.0,
            -1.0, -1.0,  1.0,
            -1.0,  1.0,  1.0,
            -1.0,  1.0, -1.0
        ],
        normals: [
            // front
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            
            // back
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            
            // top
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            
            // bottom
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,
            
            // right
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            
            // left
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0
        ],
        tangents: [
            // front
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            
            // back
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            
            // top
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            
            // bottom
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            
            // right
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            
            // left
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0
        ],
        tex: [
            // front
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // back
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // top
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // bottom
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // left
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // right
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

MeshHandler.prototype.setupTangetSphere = function (radius, shader) {

    if(shader === 0){
        this.vss = this.bumpVSS0;
        this.fss = this.bumpFSS0;
    } else if(shader === 1){
        this.vss = this.bumpVSS1;
        this.fss = this.bumpFSS1;
    }
    else if (shader === 2){
        this.vss = this.bumpVSS2;
        this.fss = this.bumpFSS2;
    }
    
    var latitudeBands = 30;
    var longitudeBands = 30;

    var verts = [];
    var tex = [];
    var inds = [];
    var normals = [];
    var tangents = [];

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
           // tangents.push(u - x);
           // tangents.push(y);
           // tangents.push(z); 
        }
    }
    
   // var coefs = [];
   // var coef;
    
   // for(var i = 0; i < tex.length; i += 2){
       // coef = 1 / (tex[i].u * tex[i+1].v - tex[i+1].u * tex[i].v);
       // coefs.push(coef);
   // }
    
    
    // TMP vec
    var tangente = new VecMath.SFVec3f(0.0, 0.0, 0.0);
    
    // Für jeden Vertex i subrahiere vertex i+1, verwende weiterhin z von i
    // -> Tangente von vertex 
    for(var i = 0; i < verts.length; i+=3){  // i+=3
        
        if(i === verts.length - 4){
            tangente.x = verts[0] - verts[i];   
            tangente.y = verts[i+1];;// - verts[i+1];
            tangente.z = verts[i+2]; // verts[i+5] - verts[i+2];
            
            tangente.normalize();
        
            tangents.push(-tangente.x);
            tangents.push(-tangente.y);
            tangents.push(-tangente.z); 
        } else if( i > verts.length - 3){
            ;
        } else {
            tangente.x = verts[i+3] - verts[i];   
            tangente.y = verts[i+1]//verts[i+4] - verts[i+1];
            tangente.z = verts[i+2]; ;
            
            tangente.normalize();
        
            tangents.push(-tangente.x);
            tangents.push(-tangente.y);
            tangents.push(-tangente.z); 
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
        tangents: tangents,
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

MeshHandler.prototype.loadOBJSpec = function (fileName, scaleFac, shader) {
    switch(shader){
        case 0: 
            // Vertex shader string
            this.vss = this.blinnPhongVSS;
            // Fragment shader string
            this.fss = this.blinnPhongFSS;
        break;
        
        case 1: 
            // Vertex shader string
            this.vss = this.deformVSS;
            // Fragment shader string
            this.fss = this.deformFSS;
            
        break;
        
        default: 
            // Vertex shader string
            this.vss = this.blinnPhongVSS;
            // Fragment shader string
            this.fss = this.blinnPhongFSS;
    }
    
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




