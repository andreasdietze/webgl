"use strict";

// ----------------------------------------------------------------------- //
// ----------------------------- ColorShader ----------------------------- //
// ----------------------------------------------------------------------- //

// Basic constructor -> set interface to GL-API
var ColorShader = function () {
    this.gl = null; // Interface to GL-API
    this.vs = null; // VertexShader
    this.fs = null; // FragmentShader
    this.sp = null; // ShaderProgram
};

// Init interface to GL
ColorShader.prototype.initGL = function (gl) {
    this.gl = gl;
};

// Initialize vertex- and fragmentShader
ColorShader.prototype.initShader = function (vsSourceString, fsSourceString) {
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

    // Initialize shaderVariables
    // Attributes
    this.sp.position = this.gl.getAttribLocation(this.sp, "position");
    this.sp.color = this.gl.getAttribLocation(this.sp, "color");
    this.sp.normal = this.gl.getAttribLocation(this.sp, "normal");

    // Uniforms
    this.sp.transformation = this.gl.getUniformLocation(this.sp, "transformation");
    this.sp.normalMat = this.gl.getUniformLocation(this.sp, "normalMat");
    this.sp.modelViewMat = this.gl.getUniformLocation(this.sp, "modelViewMat");
    this.sp.viewMat = this.gl.getUniformLocation(this.sp, "viewMat");
};

// Dispose shaders and shaderProgram
ColorShader.prototype.dispose = function () {
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

// ----------------------------------------------------------------------- //
// ----------------------------- TextureShader --------------------------- //
// ----------------------------------------------------------------------- //

// Basic constructor -> set interface to GL-API
var TextureShader = function () {
    this.gl = null; // Interface to GL-API
    this.vs = null; // VertexShader
    this.fs = null; // FragmentShader
    this.sp = null; // ShaderProgram
};

// Init interface to GL
TextureShader.prototype.initGL = function (gl) {
    this.gl = gl;
};

// Initialize vertex- and fragmentShader
TextureShader.prototype.initShader = function (vsSourceString, fsSourceString) {
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

    // Uniforms
    this.sp.translation = this.gl.getUniformLocation(this.sp, "translation");
    this.sp.tex = this.gl.getUniformLocation(this.sp, "tex");
    this.sp.transformation = this.gl.getUniformLocation(this.sp, "transformation");     
};

// Dispose shaders and shaderProgram
TextureShader.prototype.dispose = function () {
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

// ----------------------------------------------------------------------- //
// ----------------------------- LightingShader -------------------------- //
// ----------------------------------------------------------------------- //

// Basic constructor -> set interface to GL-API
var LightingShader = function () {
    this.gl = null; // Interface to GL-API
    this.vs = null; // VertexShader
    this.fs = null; // FragmentShader
    this.sp = null; // ShaderProgram
};

// Init interface to GL
LightingShader.prototype.initGL = function (gl) {
    this.gl = gl;
};

// Initialize vertex- and fragmentShader
LightingShader.prototype.initShader = function (vsSourceString, fsSourceString) {
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
    this.sp.normal = this.gl.getAttribLocation(this.sp, "normal");

    // Uniforms
    this.sp.translation = this.gl.getUniformLocation(this.sp, "translation");
    this.sp.transformation = this.gl.getUniformLocation(this.sp, "transformation");
    this.sp.normalMat = this.gl.getUniformLocation(this.sp, "normalMat");
    this.sp.modelViewMat = this.gl.getUniformLocation(this.sp, "modelViewMat");
    this.sp.viewMat = this.gl.getUniformLocation(this.sp, "viewMat");
    
};

// Dispose shaders and shaderProgram
LightingShader.prototype.dispose = function () {
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