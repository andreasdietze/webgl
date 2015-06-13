"use strict";

// ----------------------------------------------------------------------- //
// ----------------------------- ColorShader ----------------------------- //
// ----------------------------------------------------------------------- //

// Basic constructor -> set interface to GL-API
var ColorShader = function (gl) {
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

    // Uniforms
    this.sp.translation = this.gl.getUniformLocation(this.sp, "translation");
    this.sp.u_cosA = this.gl.getUniformLocation(this.sp, "u_cosA");
    this.sp.u_sinA = this.gl.getUniformLocation(this.sp, "u_sinA");
    // Kann wech, aba auch im shader wech machen -> dafür worldViewProjection (transformation)!!!
    this.sp.transformation = this.gl.getUniformLocation(this.sp, "transformation");
    this.sp.viewMatrix = this.gl.getUniformLocation(this.sp, "viewMatrix"); 
    this.sp.projectionMatrix = this.gl.getUniformLocation(this.sp, "projectionMatrix");
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
var TextureShader = function (gl) {
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