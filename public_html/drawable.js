/* global VecMath, main, MathHelper, gl */

"use strict";

// ----------------------------------------------------------------------- //
// ----------------------------- ColorDrawable --------------------------- //
// ----------------------------------------------------------------------- //

// Basic constructor -> set interface to GL-API
var ColorDrawable = function () {
    this.gl = null;       // Access to GL-API
    this.md = null;       // MeshData
    this.angle = 0.0;     // Degrees for rotationZ

};

// Init interface to GL
ColorDrawable.prototype.initGL = function (gl) {
    this.gl = gl;
};

// Init and bind buffers
ColorDrawable.prototype.initBuffers = function () {
    
    // VertexPositionBuffer
    this.md.positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.md.positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.md.vertices), this.gl.STATIC_DRAW);

    // VertexColorBuffer
    if(this.md.col){
        this.md.colorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.md.colorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.md.col), this.gl.STATIC_DRAW);
    }
    
    // NormalBuffer
    if(this.md.normals){
        this.md.normalBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.md.normalBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.md.normals), this.gl.STATIC_DRAW);
    }
    
    // IndexBuffer
    this.md.indexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.md.indexBuffer);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.md.indices), this.gl.STATIC_DRAW);
};

// Set md, translation and rotation. 
// Finally init buffers
ColorDrawable.prototype.setBufferData = function (vertices, colors, normals, indices, translation) {
    // Set md
    this.md = {
        // Setup vetices
        vertices: vertices,
        // Setup vertex colors
        col: colors,
        // Setup normals
        normals: normals,
        // Setup indices
        indices: indices,
        // Setup translation
        trans: translation
    };

    this.md.transformMatrix = VecMath.SFMatrix4f.identity();

    // Init buffers
    this.initBuffers();
};

// Geht nicht, immer die letzte function ist aktiv
ColorDrawable.prototype.update = function (transformMatrix) {
    this.md.transformMatrix = transformMatrix;
};

// Render md
ColorDrawable.prototype.draw = function (sp, viewMat, projectionMat) {

    // Use the shader
    this.gl.useProgram(sp);

    var modelView = viewMat.mult(this.md.transformMatrix);
    var modelViewProjection = projectionMat.mult(modelView);
    this.gl.uniformMatrix4fv(sp.modelViewMat, false, new Float32Array(modelView.toGL()));
    this.gl.uniformMatrix4fv(sp.transformation, false, new Float32Array(modelViewProjection.toGL()));
    
    var normalMat = modelView.inverse().transpose(); // soll moidelviewMat sein
    this.gl.uniformMatrix4fv(sp.normalMat, false, new Float32Array(normalMat.toGL()));
    
    this.gl.uniformMatrix4fv(sp.viewMat, false, new Float32Array(viewMat.toGL()));

    // Bind indexBuffer
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.md.indexBuffer);

    // Bind vertexPositionBuffer
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.md.positionBuffer);
    this.gl.vertexAttribPointer(sp.position, // index of attribute
            3, // three position components (x,y,z)
            this.gl.FLOAT, // provided data type is float
            false, // do not normalize values
            0, // stride (in bytes)
            0); // offset (in bytes)
    this.gl.enableVertexAttribArray(sp.position);

    // Bind vertexColorBuffer
    if(this.md.col){
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.md.colorBuffer);
        this.gl.vertexAttribPointer(sp.color, // index of attribute
                3, //three color components(r,g,b)
                this.gl.FLOAT, // provided data type is float
                false, // do not normalize values
                0, // stride (in bytes)
                0); // offset (in bytes)
        this.gl.enableVertexAttribArray(sp.color);
    }
    
    // Bind normalBuffer
    if(this.md.normals && !this.md.col){
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.md.normalBuffer);
        this.gl.vertexAttribPointer(sp.normal,//sp.normal, // index of attribute
                3, // three position components (x,y,z)
                this.gl.FLOAT, // provided data type is float
                false, // do not normalize values
                0, // stride (in bytes)
                0); // offset (in bytes)
        this.gl.enableVertexAttribArray(sp.normal);
    }
    
    // Draw call
    this.gl.drawElements(this.gl.TRIANGLES, // polyg type
            this.md.indices.length, // buffer length
            this.gl.UNSIGNED_SHORT, // buffer type
            0); // start index

    // Disable arributes
    this.gl.disableVertexAttribArray(sp.position);
    if(this.md.col)
        this.gl.disableVertexAttribArray(sp.color);
    if(this.md.normals && !this.md.col)
        this.gl.disableVertexAttribArray(sp.normal);
};

ColorDrawable.prototype.dispose = function () {
    // Free all buffers
    this.gl.deleteBuffer(this.md.positionBuffer);
    if(this.md.col)
        this.gl.deleteBuffer(this.md.colorBuffer);
    if(this.md.normals && !this.md.col)
        this.gl.deleteBuffer(this.md.normalBuffer);
    this.gl.deleteBuffer(this.md.indexBuffer);
};

// ----------------------------------------------------------------------- //
// ---------------------------- TextureDrawable -------------------------- //
// ----------------------------------------------------------------------- //

// Basic constructor -> set interface to GL-API
var TextureDrawable = function (path) {
    this.gl = null;       // Access to GL-API
    this.md = null;       // MeshData
    this.angle = 0.0;     // Degrees for rotationZ
    this.tex = null;
    this.path = path;
    this.gl = null;
    this.needRender = true;
};

// Init interface to GL
TextureDrawable.prototype.initGL = function (gl) {
    this.gl = gl;
};

// Init and bind buffers
TextureDrawable.prototype.initBuffers = function () {
    // VertexPositionBuffer
    this.md.positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.md.positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.md.vertices), this.gl.STATIC_DRAW);

    // TextureBuffer
    this.md.texBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.md.texBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.md.tex), this.gl.STATIC_DRAW);

    // IndexBuffer
    this.md.indexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.md.indexBuffer);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.md.indices), this.gl.STATIC_DRAW);
};

// Set md, translation and rotation. 
// Finally init buffers
TextureDrawable.prototype.setBufferData = function (vertices, tex, indices, translation) {
    // Set md
    this.md = {
        // Setup vetices
        vertices: vertices,
        // Setup vertex colors
        tex: tex,
        // Setup indices
        indices: indices,
        // Setup translation
        //trans: {x: 0, y: 0, z: 0}
        trans: translation
    };

    this.md.transformMatrix = VecMath.SFMatrix4f.identity();

    //this.tex = initTexture(this.path);
    
    // Init buffers
    this.initBuffers();
};


TextureDrawable.prototype.update = function (transformMatrix) {
    this.md.transformMatrix = transformMatrix;
    //this.needRender = true;
};

// Render md
TextureDrawable.prototype.draw = function (sp, viewMat, projectionMat) {
//function draw(sp, viewMat, projectionMat){
    
    // Use the shader
    this.gl.useProgram(sp);

    // Set uniforms
    this.gl.uniform3f(sp.translation,
            this.md.trans.x,
            this.md.trans.y,
            this.md.trans.z);

    // Set view/projection
    var modelView = viewMat.mult(this.md.transformMatrix);
    var modelViewProjection = projectionMat.mult(modelView);
    this.gl.uniformMatrix4fv(sp.transformation, false, new Float32Array(modelViewProjection.toGL()));

    // Set texture
    if(this.tex && this.tex.ready){
        this.gl.uniform1i(sp.tex, 0);
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.tex);

        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    }

    // Bind indexBuffer
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.md.indexBuffer);

    // Bind vertexPositionBuffer
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.md.positionBuffer);
    this.gl.vertexAttribPointer(sp.position, // index of attribute
            3, // three position components (x,y,z)
            this.gl.FLOAT, // provided data type is float
            false, // do not normalize values
            0, // stride (in bytes)
            0); // offset (in bytes)
    this.gl.enableVertexAttribArray(sp.position);

    // Bind texBuffer
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.md.texBuffer);
    this.gl.vertexAttribPointer(sp.texCoords, // index of attribute
            2, // two texCoords (u, v)
            this.gl.FLOAT, // provided data type is float
            false, // do not normalize values
            0, // stride (in bytes)
            0); // offset (in bytes)
    this.gl.enableVertexAttribArray(sp.texCoords);

    // Draw call
    this.gl.drawElements(this.gl.TRIANGLES, // polyg type
            this.md.indices.length, // buffer length
            this.gl.UNSIGNED_SHORT, // buffer type
            0); // start index

    // Disable arributes
    this.gl.disableVertexAttribArray(sp.position);
    this.gl.disableVertexAttribArray(sp.texCoords);

    // Set active tex
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
};

// Setup texture, example: "file.png"
TextureDrawable.prototype.initTexture = function (path) {
//function initTexture(path){
    this.tex = this.gl.createTexture();
    this.tex.ready = false;
    
    var image = new Image();
    image.crossOrigin = ''; // ?
    image.src = path;
    
    //console.log(this.tex);
    image.onload = function () {
        handleLoadedTexture(image);
    };
};

// Handle texture
function handleLoadedTexture(image) {
    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.tex);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    
    this.tex.width = image.width;
    this.tex.height = image.height;
    this.tex.ready = true;
    this.needRender = true;
};

TextureDrawable.prototype.dispose = function () {
    // Free all buffers
    this.gl.deleteBuffer(this.md.positionBuffer);
    this.gl.deleteBuffer(this.md.texBuffer);
    this.gl.deleteBuffer(this.md.indexBuffer);
};

TextureDrawable.prototype.tick = function(sp, viewMat, projectionMat){
    if(this.needRender)
        draw(sp, viewMat, projectionMat);
};

// ----------------------------------------------------------------------- //
// ------------------------ LightningTextureDrawable --------------------- //
// ----------------------------------------------------------------------- //

// Basic constructor -> set interface to GL-API
var LightingTextureDrawable = function () {
    this.gl = null;       // Access to GL-API
    this.md = null;       // MeshData
    this.angle = 0.0;     // Degrees for rotationZ
    this.tex = null;
    this.normals = null;

};

// Init interface to GL
LightingTextureDrawable.prototype.initGL = function (gl) {
    this.gl = gl;
};

// Init and bind buffers
LightingTextureDrawable.prototype.initBuffers = function () {
    this.normals = this.computeFaceNormals1(this.md.vertices, this.md.indices);

    // VertexPositionBuffer
    this.md.positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.md.positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.md.vertices), this.gl.STATIC_DRAW);

    // TextureBuffer
    this.md.texBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.md.texBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.md.tex), this.gl.STATIC_DRAW);
    
    // NormalBuffer
    this.md.normalBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.md.normalBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.normals), this.gl.STATIC_DRAW);

    // IndexBuffer
    this.md.indexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.md.indexBuffer);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.md.indices), this.gl.STATIC_DRAW);
};

// Set md, translation and rotation. 
// Finally init buffers
LightingTextureDrawable.prototype.setBufferData = function (vertices, tex, indices, translation) {
    // Set md
    this.md = {
        // Setup vetices
        vertices: vertices,
        // Setup vertex colors
        tex: tex,
        // Setup indices
        indices: indices,
        // Setup translation
        //trans: {x: 0, y: 0, z: 0}
        trans: translation
    };

    this.md.transformMatrix = VecMath.SFMatrix4f.identity();

    // Init buffers
    this.initBuffers();
};


LightingTextureDrawable.prototype.update = function (transformMatrix) {
    this.md.transformMatrix = transformMatrix;
};

// Render md
LightingTextureDrawable.prototype.draw = function (sp, viewMat, projectionMat) {

    // Use the shader
    this.gl.useProgram(sp);

    // Set uniforms
    this.gl.uniform3f(sp.translation,
            this.md.trans.x,
            this.md.trans.y,
            this.md.trans.z);
            
    // Set lightSource, viewMat aka normalMat
    //this.gl.uniform3f(sp.directionalLight)
    var normalMat = viewMat;
    this.gl.uniformMatrix4fv(sp.normalMat, false, new Float32Array(normalMat.toGL()));

    // Set view/projection
    var modelView = viewMat.mult(this.md.transformMatrix);
    var modelViewProjection = projectionMat.mult(modelView);
    this.gl.uniformMatrix4fv(sp.transformation, false, new Float32Array(modelViewProjection.toGL()));

    // Bind indexBuffer
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.md.indexBuffer);

    // Bind vertexPositionBuffer
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.md.positionBuffer);
    this.gl.vertexAttribPointer(sp.position, // index of attribute
            3, // three position components (x,y,z)
            this.gl.FLOAT, // provided data type is float
            false, // do not normalize values
            0, // stride (in bytes)
            0); // offset (in bytes)
    this.gl.enableVertexAttribArray(sp.position);
    
    // Set texture
    this.gl.uniform1i(sp.tex, 0);
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, tex);

    // Bind texBuffer
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.md.texBuffer);
    this.gl.vertexAttribPointer(sp.texCoords, // index of attribute
            2, // two texCoords (u, v)
            this.gl.FLOAT, // provided data type is float
            false, // do not normalize values
            0, // stride (in bytes)
            0); // offset (in bytes)
    this.gl.enableVertexAttribArray(sp.texCoords);
    
    // Bind normalBuffer
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.md.normalBuffer);
    this.gl.vertexAttribPointer(sp.normal,//sp.normal, // index of attribute
            3, // three position components (x,y,z)
            this.gl.FLOAT, // provided data type is float
            false, // do not normalize values
            0, // stride (in bytes)
            0); // offset (in bytes)
    this.gl.enableVertexAttribArray(sp.normal);
    

    // Draw call
    this.gl.drawElements(this.gl.TRIANGLES, // polyg type
            this.md.indices.length, // buffer length
            this.gl.UNSIGNED_SHORT, // buffer type
            0); // start index

    // Disable arributes
    this.gl.disableVertexAttribArray(sp.position);
    this.gl.disableVertexAttribArray(sp.texCoords);
};

// Setup texture, example: "file.png"
LightingTextureDrawable.prototype.initTexture = function (path) {
    this.tex = this.gl.createTexture();
    this.tex.image = new Image();
    this.tex.image.crossOrigin = ''; // ?
    this.tex.image.src = path;
    //console.log(this.tex);
    this.tex.image.onload = function () {
         handleLoadedTexture(this.tex);
    };
};

// Handle texture
function handleLoadedTexture(texture) {
    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, texture.image);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    //this.gl.bindTexture(this.gl.TEXTURE_2D, null);
};

LightingTextureDrawable.prototype.dispose = function () {
    // Free all buffers
    this.gl.deleteBuffer(this.md.positionBuffer);
    this.gl.deleteBuffer(this.md.texBuffer);
    this.gl.deleteBuffer(this.md.normalBuffer);
    this.gl.deleteBuffer(this.md.indexBuffer);
};

LightingTextureDrawable.prototype.computeFaceNormals = function(verts){
    var normals = new Array();
    //var i0, i1, i2;
    //console.log("verts: " + verts.length / 3);
    //console.log("verts: " + verts.toString());
    for(var i = 0; i < verts.length; i+=3){
        var i0 = i * 3;
        var i1 = (i + 1) * 3;
        var i2 = (i + 2) * 3;
        
        var p0 = new VecMath.SFVec3f(verts[i0], verts[i0 + 1], verts[i0 + 2]);
        //console.log("P0: " + p0.toString());
        var p1 = new VecMath.SFVec3f(verts[i1], verts[i1 + 1], verts[i1 + 2]);
        //console.log("P1: " + p1.toString());
        var p2 = new VecMath.SFVec3f(verts[i2], verts[i2 + 1], verts[i2 + 2]);
        //console.log("P2: " + p2.toString());
        
        var a = p1.subtract(p0);
        var b = p2.subtract(p1);
        
        var norm = a.cross(b).normalize();
        
        normals.push(norm);
        normals.push(norm);
        normals.push(norm);
    }
    //console.log("norms: " + normals.length.toString());
    //console.log("norms: " + normals.toString());
    return normals;
};

LightingTextureDrawable.prototype.computeFaceNormals1 = function(verts, indices){
    var normals = new Array(verts.length / 3);
    for(var i = 0; i < normals.length; i++)
        normals[i] = new VecMath.SFVec3f(0.0, 0.0, 0.0);
    
    //var i0, i1, i2;
   // console.log("posXYZ: " + verts.length + " and vectors: " + verts.length / 3);
    //console.log("verts: " + verts.toString());
    //console.log("indices: " + indices.length.toString());
    //console.log("indices: " + indices.toString());
    for(i = 0; i < indices.length; i+=3){
        var v0 = new VecMath.SFVec3f(verts[3 * indices[i]], verts[3 * indices[i]+1], verts[3 * indices[i]+2]);
        var v1 = new VecMath.SFVec3f(verts[3 * indices[i+1]], verts[3 * indices[i+1]+1], verts[3 * indices[i+2]+2]);
        var v2 = new VecMath.SFVec3f(verts[3 * indices[i+2]], verts[3 * indices[i+2]+1], verts[3 * indices[i+2]+2]);

        var a = v1.subtract(v0);
        var b = v2.subtract(v1);

        var norm = a.cross(b).normalize();

        normals[indices[i]] = normals[indices[i]].add(norm);
        normals[indices[i + 1]] = normals[indices[i + 1]].add(norm);
        normals[indices[i + 2]] = normals[indices[i + 2]].add(norm);
        
    }
    for(i = 0; i < normals.length; i++)
        normals[i] = normals[i].normalize();
    
    var finNorms = new Array();
    
    for(i = 0; i < normals.length; i++){
        finNorms[i * 3    ] = normals[i].x;
        finNorms[i * 3 + 1] = normals[i].y;
        finNorms[i * 3 + 2] = normals[i].z;
    }
    
    
    
   // console.log("norms: " + normals.length.toString());
   // console.log("norms: " + normals.toString());
    return finNorms;
};


// ----------------------------------------------------------------------- //
// ---------------------------- LightingDrawable ------------------------- //
// ----------------------------------------------------------------------- //

// Basic constructor -> set interface to GL-API
var LightingDrawable = function () {
    this.gl = null;       // Access to GL-API
    this.md = null;       // MeshData
    this.angle = 0.0;     // Degrees for rotationZ

};

// Init interface to GL
LightingDrawable.prototype.initGL = function (gl) {
    this.gl = gl;
};

// Init and bind buffers
LightingDrawable.prototype.initBuffers = function () {

    // VertexPositionBuffer
    this.md.positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.md.positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.md.vertices), this.gl.STATIC_DRAW);

    // NormalBuffer
    this.md.normalBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.md.normalBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.md.normals), this.gl.STATIC_DRAW);

    // IndexBuffer
    this.md.indexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.md.indexBuffer);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.md.indices), this.gl.STATIC_DRAW);
};

// Set md, translation and rotation. 
// Finally init buffers
LightingDrawable.prototype.setBufferData = function (vertices, colors, normals, indices, translation) {
    // Set md
    this.md = {
        // Setup vetices
        vertices: vertices,
        // Setup vertex colors
        colors: colors,
        // Setup normals
        normals: normals,
        // Setup indices
        indices: indices,
        // Setup translation
        trans: translation
    };

    this.md.transformMatrix = VecMath.SFMatrix4f.identity();

    // Init buffers
    this.initBuffers();
};


LightingDrawable.prototype.update = function (transformMatrix) {
    this.md.transformMatrix = transformMatrix;
};

// Render md
LightingDrawable.prototype.draw = function (sp, viewMat, projectionMat) {

    // Use the shader
    this.gl.useProgram(sp);

    // Set uniforms
    this.gl.uniform3f(sp.translation,
            this.md.trans.x,
            this.md.trans.y,
            this.md.trans.z);
            
    // Set lightSource, viewMat.inverse.transpose aka normalMat
    //this.gl.uniform3f(sp.directionalLight)


    // Set view/projection -> transformMatrix = worldMatrix for object
    var modelView = viewMat.mult(this.md.transformMatrix);
    var modelViewProjection = projectionMat.mult(modelView);
    this.gl.uniformMatrix4fv(sp.modelViewMat, false, new Float32Array(modelView.toGL()));
    this.gl.uniformMatrix4fv(sp.transformation, false, new Float32Array(modelViewProjection.toGL()));
    
    var normalMat = modelView.inverse().transpose(); // soll moidelviewMat sein
    this.gl.uniformMatrix4fv(sp.normalMat, false, new Float32Array(normalMat.toGL()));
    
    this.gl.uniformMatrix4fv(sp.viewMat, false, new Float32Array(viewMat.toGL()));

    // Bind indexBuffer
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.md.indexBuffer);

    // Bind vertexPositionBuffer
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.md.positionBuffer);
    this.gl.vertexAttribPointer(sp.position, // index of attribute
            3, // three position components (x,y,z)
            this.gl.FLOAT, // provided data type is float
            false, // do not normalize values
            0, // stride (in bytes)
            0); // offset (in bytes)
    this.gl.enableVertexAttribArray(sp.position);
    
    // Bind normalBuffer
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.md.normalBuffer);
    this.gl.vertexAttribPointer(sp.normal,//sp.normal, // index of attribute
            3, // three position components (x,y,z)
            this.gl.FLOAT, // provided data type is float
            false, // do not normalize values
            0, // stride (in bytes)
            0); // offset (in bytes)
    this.gl.enableVertexAttribArray(sp.normal);
    

    // Draw call
    this.gl.drawElements(this.gl.TRIANGLES, // polyg type
            this.md.indices.length, // buffer length
            this.gl.UNSIGNED_SHORT, // buffer type
            0); // start index

    // Disable arributes
    this.gl.disableVertexAttribArray(sp.position);
    this.gl.disableVertexAttribArray(sp.normals);
};

LightingDrawable.prototype.dispose = function () {
    // Free all buffers
    this.gl.deleteBuffer(this.md.positionBuffer);
    this.gl.deleteBuffer(this.md.normalBuffer);
    this.gl.deleteBuffer(this.md.indexBuffer);
};



