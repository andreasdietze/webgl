/* global VecMath, main, MathHelper */

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
    this.md.colorBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.md.colorBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.md.col), this.gl.STATIC_DRAW);

    // IndexBuffer
    this.md.indexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.md.indexBuffer);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.md.indices), this.gl.STATIC_DRAW);
};

// Set md, translation and rotation. 
// Finally init buffers
ColorDrawable.prototype.setBufferData = function (vertices, colors, indices, translation, cosA, cosB) {
    // Set md
    this.md = {
        // Setup vetices
        vertices: vertices,
        // Setup vertex colors
        col: colors,
        // Setup indices
        indices: indices,
        // Setup translation
        //trans: {x: 0, y: 0, z: 0}
        trans: translation
    };

    // Set rotation
    this.md.cosA = cosA === 0.0 ? 1.0 : cosA;
    this.md.sinA = cosB;

    this.md.transformMatrix = VecMath.SFMatrix4f.identity();

    // Init buffers
    this.initBuffers();
};

// Update/Animate 
ColorDrawable.prototype.update = function (dT, angle, transX, transY) {
    if (angle > 0.0 || angle < 0.0) {
        this.angle = angle;// * dT;
        //this.rad = Math.PI * this.angle / 180.0; // convert to rads
        this.rad = MathHelper.DTR(this.angle);
    } else
        this.rad = 0.0;

    this.md.cosA = Math.cos(this.rad);
    this.md.sinA = Math.sin(this.rad);
    
    this.md.trans.x += transX;// * dT;
    this.md.trans.y += transY;// * dT;
};

// Geht nicht, immer die letzte function ist aktiv
ColorDrawable.prototype.updateT = function (dT, transformMatrix) {
    this.md.transformMatrix = transformMatrix;
};

// Render md
ColorDrawable.prototype.draw = function (sp, viewMat, projectionMat) {

    // Use the shader
    this.gl.useProgram(sp);

    // Set uniforms
    this.gl.uniform3f(sp.translation,
            this.md.trans.x,
            this.md.trans.y,
            this.md.trans.z);

    // Vector rotation
    this.gl.uniform1f(sp.u_cosA, this.md.cosA);
    this.gl.uniform1f(sp.u_sinA, this.md.sinA);
    
        // Set final transformation matrix
    //this.gl.uniformMatrix4fv(sp.transformation, false, new Float32Array(this.md.transformMatrix.toGL()));

    // Set view/projection
    var modelView = viewMat.mult(this.md.transformMatrix);  // main.viewMat
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

    // Bind vertexColorBuffer
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.md.colorBuffer);
    this.gl.vertexAttribPointer(sp.color, // index of attribute
            3, //three color components(r,g,b)
            this.gl.FLOAT, // provided data type is float
            false, // do not normalize values
            0, // stride (in bytes)
            0); // offset (in bytes)
    this.gl.enableVertexAttribArray(sp.color);

    // Draw call
    this.gl.drawElements(this.gl.TRIANGLES, // polyg type
            this.md.indices.length, // buffer length
            this.gl.UNSIGNED_SHORT, // buffer type
            0); // start index

    // Disable arributes
    this.gl.disableVertexAttribArray(sp.position);
    this.gl.disableVertexAttribArray(sp.color);
};

ColorDrawable.prototype.dispose = function () {
    // Free all buffers
    this.gl.deleteBuffer(this.md.positionBuffer);
    this.gl.deleteBuffer(this.md.colorBuffer);
    this.gl.deleteBuffer(this.md.indexBuffer);
};

// ----------------------------------------------------------------------- //
// ---------------------------- TextureDrawable -------------------------- //
// ----------------------------------------------------------------------- //

// Basic constructor -> set interface to GL-API
var TextureDrawable = function () {
    this.gl = null;       // Access to GL-API
    this.md = null;       // MeshData
    this.angle = 0.0;     // Degrees for rotationZ
    this.tex = null;

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

    // Init buffers
    this.initBuffers();
};


TextureDrawable.prototype.update = function (transformMatrix) {
    this.md.transformMatrix = transformMatrix;
};

// Render md
TextureDrawable.prototype.draw = function (sp, viewMat, projectionMat) {

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
TextureDrawable.prototype.initTexture = function (path) {
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

TextureDrawable.prototype.dispose = function () {
    // Free all buffers
    this.gl.deleteBuffer(this.md.positionBuffer);
    this.gl.deleteBuffer(this.md.texBuffer);
    this.gl.deleteBuffer(this.md.indexBuffer);
};


// ----------------------------------------------------------------------- //
// ------------------------ LightningTextureDrawable --------------------- //
// ----------------------------------------------------------------------- //

// Basic constructor -> set interface to GL-API
var LightningTextureDrawable = function () {
    this.gl = null;       // Access to GL-API
    this.md = null;       // MeshData
    this.angle = 0.0;     // Degrees for rotationZ
    this.tex = null;
    this.normals = null;

};

// Init interface to GL
LightningTextureDrawable.prototype.initGL = function (gl) {
    this.gl = gl;
};

// Init and bind buffers
LightningTextureDrawable.prototype.initBuffers = function () {
    this.normals = this.computeFaceNormals1(this.md.vertices, this.md.indices);

    // VertexPositionBuffer
    this.md.positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.md.positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.md.vertices), this.gl.STATIC_DRAW);

    // TextureBuffer
    this.md.texBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.md.texBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.md.tex), this.gl.STATIC_DRAW);
    
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
LightningTextureDrawable.prototype.setBufferData = function (vertices, tex, indices, translation) {
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


LightningTextureDrawable.prototype.update = function (transformMatrix) {
    this.md.transformMatrix = transformMatrix;
};

// Render md
LightningTextureDrawable.prototype.draw = function (sp, viewMat, projectionMat) {

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
LightningTextureDrawable.prototype.initTexture = function (path) {
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

LightningTextureDrawable.prototype.dispose = function () {
    // Free all buffers
    this.gl.deleteBuffer(this.md.positionBuffer);
    this.gl.deleteBuffer(this.md.texBuffer);
    this.gl.deleteBuffer(this.md.normalBuffer);
    this.gl.deleteBuffer(this.md.indexBuffer);
};

LightningTextureDrawable.prototype.computeFaceNormals = function(verts){
    var normals = new Array();
    //var i0, i1, i2;
    console.log("verts: " + verts.length / 3);
    console.log("verts: " + verts.toString());
    for(var i = 0; i < verts.length; i+=3){
        var i0 = i * 3;
        var i1 = (i + 1) * 3;
        var i2 = (i + 2) * 3;
        
        var p0 = new VecMath.SFVec3f(verts[i0], verts[i0 + 1], verts[i0 + 2]);
        console.log("P0: " + p0.toString());
        var p1 = new VecMath.SFVec3f(verts[i1], verts[i1 + 1], verts[i1 + 2]);
        console.log("P1: " + p1.toString());
        var p2 = new VecMath.SFVec3f(verts[i2], verts[i2 + 1], verts[i2 + 2]);
        console.log("P2: " + p2.toString());
        
        var a = p1.subtract(p0);
        var b = p2.subtract(p1);
        
        var norm = a.cross(b).normalize();
        
        normals.push(norm);
        normals.push(norm);
        normals.push(norm);
    }
    console.log("norms: " + normals.length.toString());
    console.log("norms: " + normals.toString());
    return normals;
};

LightningTextureDrawable.prototype.computeFaceNormals1 = function(verts, indices){
    var normals = new Array(verts.length / 3);
    for(var i = 0; i < normals.length; i++)
        normals[i] = new VecMath.SFVec3f(0.0, 0.0, 0.0);
    
    //var i0, i1, i2;
    console.log("posXYZ: " + verts.length + " and vectors: " + verts.length / 3);
    console.log("verts: " + verts.toString());
    console.log("indices: " + indices.length.toString());
    console.log("indices: " + indices.toString());
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
    
    
    
    console.log("norms: " + normals.length.toString());
    console.log("norms: " + normals.toString());
    return finNorms;
};



