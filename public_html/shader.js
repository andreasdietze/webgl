"use strict";

// ----------------------------------------------------------------------- //
// ----------------------------- Shader ----------------------------- //
// ----------------------------------------------------------------------- //

// Basic constructor -> set interface to GL-API
var Shader = function () {
    this.gl = null; // Interface to GL-API
    this.vs = null; // VertexShader
    this.fs = null; // FragmentShader
    this.sp = null; // ShaderProgram
};

// Init interface to GL
Shader.prototype.initGL = function (gl) {
    this.gl = gl;
};

// Initialize vertex- and fragmentShader
Shader.prototype.initShader = function (vsSourceString, fsSourceString) {
    // First, create vertexShader
    this.vs = this.gl.createShader(this.gl.VERTEX_SHADER);
    // Set vs source string
    this.gl.shaderSource(this.vs, vsSourceString);
    // Compile vertexShader
    this.gl.compileShader(this.vs);
    // Check compile status
    if (!this.gl.getShaderParameter(this.vs, this.gl.COMPILE_STATUS)) {
        console.warn("VertexShader: " + this.gl.getShaderInfoLog(vs));
    }

    // Create fragmentShader
    this.fs = this.gl.createShader(this.gl.FRAGMENT_SHADER);
    // Set fs source string
    this.gl.shaderSource(this.fs, fsSourceString);
    // Compile fragmentShader
    this.gl.compileShader(this.fs);
    // Check compile status
    if (!this.gl.getShaderParameter(this.fs, this.gl.COMPILE_STATUS)) {
        console.warn("FragmentShader: " + this.gl.getShaderInfoLog(fs));
    }

    // Create shaderProgram
    this.sp = this.gl.createProgram();

    // Attach shaders
    this.gl.attachShader(this.sp, this.vs);
    this.gl.attachShader(this.sp, this.fs);

    // Link shaders
    this.gl.linkProgram(this.sp);
    // Check link status
    if (!this.gl.getProgramParameter(this.sp, this.gl.LINK_STATUS)) {
        console.warn("Could not link program: " + this.gl.getProgramInfoLog(this.sp));
    }

    // Attributes
    this.sp.position = this.gl.getAttribLocation(this.sp, "position");
    this.sp.color = this.gl.getAttribLocation(this.sp, "color");
    this.sp.texCoords = this.gl.getAttribLocation(this.sp, "texCoords");
    this.sp.normal = this.gl.getAttribLocation(this.sp, "normal");

    // Uniforms material
    this.sp.matAmbi = this.gl.getUniformLocation(this.sp, "Ka");
    this.sp.matDiff = this.gl.getUniformLocation(this.sp, "Kd");
    this.sp.matSpec = this.gl.getUniformLocation(this.sp, "Ks");
    this.sp.matEmis = this.gl.getUniformLocation(this.sp, "Ke");
    this.sp.tex = this.gl.getUniformLocation(this.sp, "tex");
    this.sp.bump = this.gl.getUniformLocation(this.sp, "bump");
    this.sp.texTrue = this.gl.getUniformLocation(this.sp, "texTrue");
    
    // Uniforms lighting
    this.sp.lighting = this.gl.getUniformLocation(this.sp, "lighting");
    this.sp.shininess = this.gl.getUniformLocation(this.sp, "shininess");
    this.sp.diffIntensity = this.gl.getUniformLocation(this.sp, "diffIntensity");
    this.sp.specIntensity = this.gl.getUniformLocation(this.sp, "specIntensity");
    this.sp.lightColor = this.gl.getUniformLocation(this.sp, "lightColor");
    this.sp.specColor = this.gl.getUniformLocation(this.sp, "specularColor");
    this.sp.ambiColor = this.gl.getUniformLocation(this.sp, "ambientColor");
    
    // Uniforms spaces
    this.sp.transformation = this.gl.getUniformLocation(this.sp, "transformation");
    this.sp.viewMat = this.gl.getUniformLocation(this.sp, "viewMat"); 
    this.sp.normalMat = this.gl.getUniformLocation(this.sp, "normalMat");
    this.sp.modelViewMat = this.gl.getUniformLocation(this.sp, "modelViewMat");
    
    // Time
    this.sp.time = this.gl.getUniformLocation(this.sp, "time");
    
    // Deform
    this.sp.deform = this.gl.getUniformLocation(this.sp, "deformStyle");
    this.sp.defInt = this.gl.getUniformLocation(this.sp, "defInt");
    this.sp.defAmt = this.gl.getUniformLocation(this.sp, "defAmt");
   
};

// Dispose shaders and shaderProgram
Shader.prototype.dispose = function () {
    // Free vertexShader
    if(this.gl && this.sp){
        this.gl.detachShader(this.sp, this.vs);
        this.gl.deleteShader(this.vs);

        // Free fragmentShader
        this.gl.detachShader(this.sp, this.fs);
        this.gl.deleteShader(this.fs);

        // Free program
        this.gl.deleteProgram(this.sp);
    }
    this.sp = null;
};


// ----------------------------------------------------------------------- //
// ------------------------- DiffuseLightingShader ----------------------- //
// ----------------------------------------------------------------------- //

// Basic constructor -> set interface to GL-API
var DiffuseLightingShader = function () {
    this.gl = null; // Interface to GL-API
    this.vs = null; // VertexShader
    this.fs = null; // FragmentShader
    this.sp = null; // ShaderProgram
};

// Init interface to GL
DiffuseLightingShader.prototype.initGL = function (gl) {
    this.gl = gl;
};

// Initialize vertex- and fragmentShader
DiffuseLightingShader.prototype.initShader = function (vsSourceString, fsSourceString) {
    // First, create vertexShader
    this.vs = this.gl.createShader(this.gl.VERTEX_SHADER);
    // Set vs source string
    this.gl.shaderSource(this.vs, vsSourceString);
    // Compile vertexShader
    this.gl.compileShader(this.vs);
    // Check compile status
    if (!this.gl.getShaderParameter(this.vs, this.gl.COMPILE_STATUS)) {
        console.warn("VertexShader: " + this.gl.getShaderInfoLog(this.vs));
    }

    // Create fragmentShader
    this.fs = this.gl.createShader(this.gl.FRAGMENT_SHADER);
    // Set fs source string
    this.gl.shaderSource(this.fs, fsSourceString);
    // Compile fragmentShader
    this.gl.compileShader(this.fs);
    // Check compile status
    if (!this.gl.getShaderParameter(this.fs, this.gl.COMPILE_STATUS)) {
        console.warn("FragmentShader: " + this.gl.getShaderInfoLog(this.fs));
    }

    // Create shaderProgram
    this.sp = this.gl.createProgram();

    // Attach shaders
    this.gl.attachShader(this.sp, this.vs);
    this.gl.attachShader(this.sp, this.fs);

    // Link shaders
    this.gl.linkProgram(this.sp);
    // Check link status
    if (!this.gl.getProgramParameter(this.sp, this.gl.LINK_STATUS)) {
        console.warn("Could not link program: " + this.gl.getProgramInfoLog(this.sp));
    }

    // Initialize shaderVariables
    // Attributes
    this.sp.position = this.gl.getAttribLocation(this.sp, "position");
    this.sp.texCoords = this.gl.getAttribLocation(this.sp, "texCoords");
    this.sp.normal = this.gl.getAttribLocation(this.sp, "normal");

    // Uniforms
    this.sp.translation = this.gl.getUniformLocation(this.sp, "translation");
    this.sp.tex = this.gl.getUniformLocation(this.sp, "tex");
    this.sp.transformation = this.gl.getUniformLocation(this.sp, "transformation");
    this.sp.normalMat = this.gl.getUniformLocation(this.sp, "normalMat");
    // brauche noch normalMatrix -> ist invertierte modelviewMatrix -> also viewMat
    // und nicht modelViewProjection
    // Lichtvector und Farben erstmal so im Shader erstellen -> ansonsten hier init
};

// Dispose shaders and shaderProgram
DiffuseLightingShader.prototype.dispose = function () {
    // Free vertexShader
    this.gl.detachShader(this.sp, this.vs);
    this.gl.deleteShader(this.vs);

    // Free fragmentShader
    this.gl.detachShader(this.sp, this.fs);
    this.gl.deleteShader(this.fs);

    // Free program
    this.gl.deleteProgram(this.sp);
    this.sp = null;
};
