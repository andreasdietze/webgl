
/* global VecMath, MathHelper */

"use strict";

// Globals 
var vertexShader = null, // VS -> VS und FS können zusammengefasst werden zu shader
        fragmentShader = null, // FS
        shaderProgram = null, // SP
        gl = null, // GL
        meshData = null, // Object data
        angle = 0.0, // Rotation
        tex = null, // Texture
        viewMat = VecMath.SFMatrix4f.identity(), // View matrix (camera)
        projectionMat = VecMath.SFMatrix4f.identity(); // Matrix for perspective or orthogonal projection
        
var angleX = 0;
var angleY = 0;
var radY = 0;
var radX = 0;
var camPos = new VecMath.SFVec3f(0.0, 0.0, 7.5);
var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;
var mouseX = null, mouseY = null;
var moveVecNF = new VecMath.SFVec3f(0.0, 0.0, 0.0),
    moveVecLR = new VecMath.SFVec3f(0.0, 0.0, 0.0);
    
var direction, normalizedDirection;


// make sure browser knows requestAnimationFrame method
if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (function () {
        return  window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (callback, element) {
                    window.setTimeout(callback, 16);
                };
    })();
}

var lastFrameTime = new Date().getTime();
// Create meshHandler object
var mh = new MeshHandler();

// Create shader object
var houseShader = new ColorShader();
// Create drawable object
var house = new ColorDrawable();

// Create textured house
var houseShaderTex = new TextureShader();
var houseTex = new TextureDrawable();

// Create secondPointer
var secondPointerShader = new ColorShader();
var secondPointer = new ColorDrawable();

// Create minutePointer
var minutePointerShader = new ColorShader();
var minutePointer = new ColorDrawable();

// Create hourPointer
var hourPointerShader = new ColorShader();
var hourPointer = new ColorDrawable();

// Create box
var boxShader = new ColorShader();
var box = new ColorDrawable();

// Create textured Box
var boxShaderTex = new TextureShader();
var boxTex = new TextureDrawable();

// Create sphere
var sphereShader = new ColorShader();
var sphere = new ColorDrawable();

// Another sphere
var sphereShader1 = new ColorShader();
var sphere1 = new ColorDrawable();

// Textured box
var boxTex2 = new TextureDrawable();

// Textured sphere
var sphereTexShader = new TextureShader();
var sphereTex = new TextureDrawable();

// Orientation box
var oBoxShader = new ColorShader();
var oBox = new ColorDrawable();

// Scenes
var sceneOne;
var orientationScene;

var boxDiffuseShader = new DiffuseLightingShader();
var boxDiffuse = new LightingTextureDrawable();

var objCowShader = new LightingShader();
var objCow = new LightingDrawable();

var objCowShader = new LightingShader();
var objCow = new LightingDrawable();

var objCowShaderSpec = new LightingShader();
var objCowSpec = new LightingDrawable();



// MAIN
function main() {
    console.log("Init program");
    // Get canvas
    var canvas = document.getElementById("glCanvas");
    // Set context attributes
    var ctxAttribs = {alpha: true, depth: true, antialias: true, premultipliedAlpha: false};
    // Create GL-Oject 
    gl = canvas.getContext("webgl", ctxAttribs) ||
            canvas.getContext("experimental-webgl", ctxAttribs);

    // Init projection
    initProjection();

    // Init VS / FS
    initShaders();

    // Setup triangle
    setupMeshData();

    initTexture();
    
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;

    // Setup meshData for house
    mh.setupHouse();
    // Init gl
    houseShader.initGL(gl);
    // Init shaders
    houseShader.initShader(mh.vss, mh.fss);
    // Init gl
    house.initGL(gl);
    // Init buffers
    house.setBufferData(mh.mesh.vertices,
            mh.mesh.col,
            mh.mesh.indices,
            mh.mesh.trans,
            mh.mesh.cosA,
            mh.mesh.sinA);

    // Setup meshData for secondPointer
    mh.setupSecPointer();
    secondPointerShader.initGL(gl);
    secondPointerShader.initShader(mh.vss, mh.fss);
    secondPointer.initGL(gl);
    secondPointer.setBufferData(mh.mesh.vertices,
            mh.mesh.col,
            mh.mesh.indices,
            mh.mesh.trans,
            mh.mesh.cosA,
            mh.mesh.sinA);

    // Setup meshData for secondPointer
    mh.setupMinPointer();
    minutePointerShader.initGL(gl);
    minutePointerShader.initShader(mh.vss, mh.fss);
    minutePointer.initGL(gl);
    minutePointer.setBufferData(mh.mesh.vertices,
            mh.mesh.col,
            mh.mesh.indices,
            mh.mesh.trans,
            mh.mesh.cosA,
            mh.mesh.sinA);

    // Setup meshData for hourPointer
    mh.setupHourPointer();
    hourPointerShader.initGL(gl);
    hourPointerShader.initShader(mh.vss, mh.fss);
    hourPointer.initGL(gl);
    hourPointer.setBufferData(mh.mesh.vertices,
            mh.mesh.col,
            mh.mesh.indices,
            mh.mesh.trans,
            mh.mesh.cosA,
            mh.mesh.sinA);

    // Setup meshData for box
    mh.setupBox(0.25);
    boxShader.initGL(gl);
    // console.log(mh.vss);
    boxShader.initShader(mh.vss, mh.fss);
    //console.log(mh.vss);
    box.initGL(gl);
    box.setBufferData(mh.mesh.vertices,
            mh.mesh.col,
            mh.mesh.indices,
            mh.mesh.trans,
            mh.mesh.cosA,
            mh.mesh.sinA);    
           
    // Setup meshData for sphere
    mh.setupSphere(0.4, 2);
    sphereShader.initGL(gl);
    sphereShader.initShader(mh.vss, mh.fss);
    sphere.initGL(gl);
    sphere.setBufferData(mh.mesh.vertices,
            mh.mesh.col,
            mh.mesh.indices,
            mh.mesh.trans,
            mh.mesh.cosA,
            mh.mesh.sinA);

    mh.setupSphere(0.4, 1);
    sphereShader1.initGL(gl);
    sphereShader1.initShader(mh.vss, mh.fss);
    sphere1.initGL(gl);
    sphere1.setBufferData(mh.mesh.vertices,
            mh.mesh.col,
            mh.mesh.indices,
            mh.mesh.trans,
            mh.mesh.cosA,
            mh.mesh.sinA);
            
    mh.setupTexturedHouse();
    houseShaderTex.initGL(gl);
    houseShaderTex.initShader(mh.vss, mh.fss);
    houseTex.initGL(gl);
    houseTex.setBufferData(mh.mesh.vertices,
            mh.mesh.tex,
            mh.mesh.indices,
            mh.mesh.trans);
    houseTex.initTexture("crazyCube.png");
    
    mh.setupTexturedBox(0.25);
    boxShaderTex.initGL(gl);
    boxShaderTex.initShader(mh.vss, mh.fss);
    boxTex.initGL(gl);
    boxTex.setBufferData(mh.mesh.vertices,
            mh.mesh.tex,
            mh.mesh.indices,
            mh.mesh.trans);
    boxTex.initTexture("crazyCube.png");
    
    mh.setupTexturedBox6f();
    boxTex2.initGL(gl);
    boxTex2.setBufferData(mh.mesh.vertices,
            mh.mesh.tex,
            mh.mesh.indices,
            mh.mesh.trans);
    boxTex2.initTexture("crazyCube.png");
    
    mh.setupTexturedSphere(0.4);
    sphereTexShader.initGL(gl);
    sphereTexShader.initShader(mh.vss, mh.fss);
    sphereTex.initGL(gl);
    sphereTex.setBufferData(mh.mesh.vertices,
            mh.mesh.tex,
            mh.mesh.indices,
            mh.mesh.trans);
    sphereTex.initTexture("crazyCube.png");
    
    mh.setupBox6c(0.25);
    oBoxShader.initGL(gl);
    oBoxShader.initShader(mh.vss, mh.fss);
    oBox.initGL(gl);
    oBox.setBufferData(mh.mesh.vertices,
            mh.mesh.col,
            mh.mesh.indices,
            mh.mesh.trans,
            mh.mesh.cosA,
            mh.mesh.sinA);  

    sceneOne = new MultipleObjects(gl, mh);
    orientationScene = new OrientationScene(gl, mh);
    
    mh.setupDiffusedBox();
    boxDiffuseShader.initGL(gl);
    boxDiffuseShader.initShader(mh.vss, mh.fss);
    boxDiffuse.initGL(gl);
    boxDiffuse.setBufferData(mh.mesh.vertices,
            mh.mesh.tex,
            mh.mesh.indices,
            mh.mesh.trans);
    boxDiffuse.initTexture("crazyCube.png");
    
    
    mh.loadOBJ("Models/cow.obj", 0.175);
    objCowShader.initGL(gl);
    objCowShader.initShader(mh.vss, mh.fss);
    objCow.initGL(gl);
    objCow.setBufferData(mh.mesh.vertices,
                         mh.mesh.colors,
                         mh.mesh.normals,
                         mh.mesh.indices,
                         mh.mesh.trans);
                         
    mh.loadOBJSpec("Models/cow.obj", 0.175);
    objCowShaderSpec.initGL(gl);
    objCowShaderSpec.initShader(mh.vss, mh.fss);
    objCowSpec.initGL(gl);
    objCowSpec.setBufferData(mh.mesh.vertices,
                         mh.mesh.colors,
                         mh.mesh.normals,
                         mh.mesh.indices,
                         mh.mesh.trans);
                         
    
    var mat = VecMath.SFMatrix4f.identity();
    mat = mat.mult(VecMath.SFMatrix4f.translation(new VecMath.SFVec3f(5.0, 5.0, 0.0)));
    
    console.log(mat);
    var vec = new VecMath.SFVec3f(0.0, 5.0, 0.0);
    
    var fooVec = mat.multMatrixPnt(vec);
    console.log(fooVec);
            
    // Draw-loop
    (function mainLoop() {

        // Transformation
        animate(canvas);

        // Drawing process
        draw(canvas);

        //house.draw(houseShader.sp, viewMat, projectionMat);
        
        // Colored and textured without lighting
        secondPointer.draw(secondPointerShader.sp, viewMat, projectionMat);
        minutePointer.draw(minutePointerShader.sp, viewMat, projectionMat);
        hourPointer.draw(hourPointerShader.sp, viewMat, projectionMat);
        box.draw(boxShader.sp, viewMat, projectionMat);
        sphere.draw(sphereShader.sp, viewMat, projectionMat);
        sphere1.draw(sphereShader.sp, viewMat, projectionMat);
        houseTex.draw(houseShaderTex.sp, viewMat, projectionMat);
        boxTex.draw(boxShaderTex.sp, viewMat, projectionMat);
        boxTex2.draw(boxShaderTex.sp, viewMat, projectionMat);
        sphereTex.draw(sphereTexShader.sp, viewMat, projectionMat);
        
        //oBox.draw(oBoxShader.sp, viewMat, projectionMat);
        
        // Scenes
        sceneOne.draw(boxShader, sphereShader, viewMat, projectionMat);
        orientationScene.draw(boxShader, viewMat, projectionMat);
        
        // Lighting
        boxDiffuse.draw(boxDiffuseShader.sp, viewMat, projectionMat);
        objCow.draw(objCowShader.sp, viewMat, projectionMat);
        objCowSpec.draw(objCowShaderSpec.sp, viewMat, projectionMat);
        
        // Renderloop 
        window.requestAnimationFrame(mainLoop);
    })();

}

// Clear color, depth and set viewport
function clearBackBuffer(canvas) {
    // Clear color to black
    gl.clearColor(0.3, 0.5, 0.2, 0.3);
    // Clear depth to max (1.0) min(0.0)
    gl.clearDepth(1.0);
    // Init viewport
    gl.viewport(0, 0, canvas.width, canvas.height);
    // Clear color or depth bit
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // Enable depth test
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    // Cullmode
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    // Blending
    //gl.enable(gl.BLEND);
    //gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
}

// Init a single VS and FS
function initShaders() {

    var preamble = "#ifdef GL_FRAGMENT_PRECISION_HIGH\n" +
            "  precision highp float;\n" +
            "#else\n" +
            "  precision mediump float;\n" +
            "#endif\n\n";

    // Vertex shader string
    var vsSourceString =
            "attribute vec3 position;\n" +
            "attribute vec2 texCoord;\n" +
            "uniform vec3 translation;\n" +
            "uniform float u_cosA, u_sinA;\n" +
            "uniform mat4 modelViewProjection;\n" +  // World ?_?
            "uniform mat4 viewMatrix;\n" +
            "uniform mat4 projectionMatrix;\n" +
            "varying vec2 vTexCoord;\n" +
            "void main() {\n" +
            "   vTexCoord = texCoord;\n" +
            //"   vec3 pos = vec3(position.x * u_cosA - position.y * u_sinA, position.x * u_sinA + position.y * u_cosA, position.z);\n" +
            //"   gl_Position = vec4(pos + translation, 1.0);\n" +
            "   gl_Position = modelViewProjection * vec4(position , 1.0);\n" +
            "}\n";

    // Fragment shader string
    var vsFragmentString = preamble +
            "uniform sampler2D tex;\n" +
            "varying vec2 vTexCoord;\n" +
            "void main() {\n" +
            "   gl_FragColor = texture2D(tex, vTexCoord);\n" +
            "}\n";

    // VS				
    vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vsSourceString);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.warn("VertexShader: " + gl.getShaderInfoLog(vertexShader));
    }

    // FS
    fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, vsFragmentString);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.warn("FragmentShader: " + gl.getShaderInfoLog(fragmentShader));
    }

    // Shader program object 
    shaderProgram = gl.createProgram();

    // Attach shaders
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);

    // Link shaders
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.warn("Could not link program: " + gl.getProgramInfoLog(shaderProgram));
    }

    // Init only once
    initShaderVars();
}

// initialize attribute and uniform access by dynamically adding member variables
function initShaderVars() {
    // attributes (name from shaders)
    shaderProgram.position = gl.getAttribLocation(shaderProgram, "position");
    shaderProgram.texCoord = gl.getAttribLocation(shaderProgram, "texCoord");

    // uniforms (name from shaders)
    shaderProgram.translation = gl.getUniformLocation(shaderProgram, "translation");
    shaderProgram.u_cosA = gl.getUniformLocation(shaderProgram, "u_cosA");
    shaderProgram.u_sinA = gl.getUniformLocation(shaderProgram, "u_sinA");
    shaderProgram.tex = gl.getUniformLocation(shaderProgram, "tex");
    shaderProgram.modelViewProjection = gl.getUniformLocation(shaderProgram, "modelViewProjection");
}

// Draw scene
function draw(canvas) {
    // Clear backbuffer
    clearBackBuffer(canvas);

    // Use the shader
    gl.useProgram(shaderProgram);
    
    // Set uniforms
    // Set translation
    gl.uniform3f(shaderProgram.translation,
            meshData.trans.x,
            meshData.trans.y,
            meshData.trans.z);

    // Set final transformation matrix
    //gl.uniformMatrix4fv(shaderProgram.modelViewProjection, false, new Float32Array(meshData.transMat.toGL())); // ist worldMat !!!

    // Set rotation
    gl.uniform1f(shaderProgram.u_cosA, meshData.cosA);
    gl.uniform1f(shaderProgram.u_sinA, meshData.sinA);

    // Set world(transMat)/view/projection
    var modelView = viewMat.mult(meshData.transMat);
    var modelViewProjection = projectionMat.mult(modelView);
    gl.uniformMatrix4fv(shaderProgram.modelViewProjection, false, new Float32Array(modelViewProjection.toGL()));

    // Bind indexBuffer
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, meshData.indexBuffer);

    // Bind vertexPositionBuffer
    gl.bindBuffer(gl.ARRAY_BUFFER, meshData.positionBuffer);
    gl.vertexAttribPointer(shaderProgram.position, // indes of attribute
            3, // three position components (x,y,z)
            gl.FLOAT, // provided data type is float
            false, // do not normalize values
            0, // stride (in bytes)
            0); // offset (in bytes)
    gl.enableVertexAttribArray(shaderProgram.position);

    // Set texture
    gl.uniform1i(shaderProgram.tex, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);

    // Bind vertexColorBuffer
    gl.bindBuffer(gl.ARRAY_BUFFER, meshData.texBuffer);
    gl.vertexAttribPointer(shaderProgram.texCoord, // index of attribute
            2, // two components(u, v)
            gl.FLOAT, // provided data type is float
            false, // do not normalize values
            0, // stride (in bytes)
            0); // offset (in bytes)
    gl.enableVertexAttribArray(shaderProgram.texCoord);

    // Draw call
   /* gl.drawElements(gl.TRIANGLES, // polyg type
            meshData.indices.length, // buffer length
            gl.UNSIGNED_SHORT, // buffer type
            0); // start index*/

    // Disable arributes
    gl.disableVertexAttribArray(shaderProgram.position);
    gl.disableVertexAttribArray(shaderProgram.texCoord);

}

function setupMeshData() {
    // Setup triangle vertices
    meshData = {
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
        trans: {x: 0, y: 0, z: 0},
        // Setup scale
        scale: {x: 0, y: 0, z: 0}
    };
    meshData.cosA = 1.0;
    meshData.sinA = 0.0;

    // Transformation matrix
    meshData.matT = VecMath.SFMatrix4f.identity();

    // Rotation-Z matirx
    meshData.matR = VecMath.SFMatrix4f.identity();

    // Scale matrix
    meshData.matS = VecMath.SFMatrix4f.identity();

    // Final transformMatrix
    meshData.transMat = VecMath.SFMatrix4f.identity();

    // Init Buffers for meshData
    initBuffers();
}

var count = 0;
var fps = 0;
var lastTime;

var foo = 0;
var hours = 0;
// Update
function animate(canvas) {
    var currentTime = Date.now(); //new Date().getTime();
    var dT = currentTime - lastFrameTime;
    dT /= 1000;
    //console.log("DeltaTime: " + dT.toFixed(2));

    if (!lastTime) {
        lastTime = new Date().getTime();
        count = 1;
    }
    else
    {
        var curTime = new Date().getTime();
        var dif = curTime - lastTime;
        if (dif > 1000) {
            lastTime = curTime;
            fps = count;
            //console.log("FPS: " + fps);
            count = 0;
        }
        else {
            count++;
        }
    }
    
    // Handle user input
    handleKeyboard(window, dT);    // window
    handleKeys();

    hours = new Date().getHours();
    if (hours > 12)
        hours -= 12;

    //console.log(hours);

    // Animate meshData
    foo -= 1;
    house.update(dT, // deltaTime
            foo, // angle
            0, // speedX
            0); // speedY

    secondPointer.update(dT, // deltaTime
            -6 * new Date().getSeconds(), // angle
            0, // speedX
            0); // speedY

    minutePointer.update(dT, // deltaTime
            -6 * new Date().getMinutes(), // angle
            0, // speedX
            0); // speedY

    hourPointer.update(dT, // deltaTime
            -30 * hours, // angle
            0, // speedX
            0); // speedY

    box.md.transformMatrix._03 = 1.5;
    box.md.transformMatrix._13 = 1.0;
    box.md.transformMatrix._23 = 0.0;
    var rotMat = VecMath.SFMatrix4f.rotationX(1 * dT);
    box.md.transformMatrix = box.md.transformMatrix.mult(rotMat);

    sphere.md.transformMatrix._03 = -1.5;
    sphere.md.transformMatrix._13 = -1.0;
    sphere.md.transformMatrix._23 = 0.0;
    rotMat = VecMath.SFMatrix4f.rotationY(1 * dT);
    sphere.md.transformMatrix = sphere.md.transformMatrix.mult(rotMat);
    //sphere.updateT(dT, sphere.md.transformMatrix); 

    sphere1.md.transformMatrix._03 = 1.5;
    sphere1.md.transformMatrix._13 = -1.0;
    sphere1.md.transformMatrix._23 = 0.0;
    rotMat = VecMath.SFMatrix4f.rotationX(1 * dT);
    sphere1.md.transformMatrix = sphere1.md.transformMatrix.mult(rotMat);
    
    sphereTex.md.transformMatrix._03 = 1.5;
    sphereTex.md.transformMatrix._13 = 0.0;
    sphereTex.md.transformMatrix._23 = 0.0;
    rotMat = VecMath.SFMatrix4f.rotationX(1 * dT);
    sphereTex.md.transformMatrix = sphereTex.md.transformMatrix.mult(rotMat);
    
    houseTex.md.transformMatrix._03 = 0.0;
    houseTex.md.transformMatrix._13 = 2.0;
    houseTex.md.transformMatrix._23 = 0.0;
    
    boxTex.md.transformMatrix._03 = -1.5;
    boxTex.md.transformMatrix._13 = 1.0;
    boxTex.md.transformMatrix._23 = 0.0;
    rotMat = VecMath.SFMatrix4f.rotationX(1 * dT);
    boxTex.md.transformMatrix = boxTex.md.transformMatrix.mult(rotMat);
    
    // Nicht vergessen vorher mit Identitätsmatrix zu multiplizieren !!!
    boxTex2.md.transformMatrix = VecMath.SFMatrix4f.identity();
    boxTex2.md.transformMatrix = boxTex2.md.transformMatrix.mult(
            VecMath.SFMatrix4f.translation(new VecMath.SFVec3f(-1.5, 0.0, 0.0)));
    boxTex2.md.transformMatrix = boxTex2.md.transformMatrix.mult(
            VecMath.SFMatrix4f.rotationY(MathHelper.DTR(angle)));
    boxTex2.md.transformMatrix = boxTex2.md.transformMatrix.mult(
           VecMath.SFMatrix4f.scale(new VecMath.SFVec3f(0.25, 0.25, 0.25))); 
   
   
    boxDiffuse.md.transformMatrix = VecMath.SFMatrix4f.identity();
    boxDiffuse.md.transformMatrix = boxDiffuse.md.transformMatrix.mult(
            VecMath.SFMatrix4f.translation(new VecMath.SFVec3f(-2.5, 0.0, 0.0)));
    boxDiffuse.md.transformMatrix = boxDiffuse.md.transformMatrix.mult(
            VecMath.SFMatrix4f.rotationY(MathHelper.DTR(angle)));
    boxDiffuse.md.transformMatrix = boxDiffuse.md.transformMatrix.mult(
           VecMath.SFMatrix4f.scale(new VecMath.SFVec3f(0.25, 0.25, 0.25))); 
   
    oBox.md.transformMatrix = VecMath.SFMatrix4f.identity();
    oBox.md.transformMatrix = oBox.md.transformMatrix.mult(
            VecMath.SFMatrix4f.translation(new VecMath.SFVec3f(0.0, 0.0, 0.0)));
    oBox.md.transformMatrix = oBox.md.transformMatrix.mult(
            VecMath.SFMatrix4f.rotationY(MathHelper.DTR(0.0)));
    oBox.md.transformMatrix = oBox.md.transformMatrix.mult(
           VecMath.SFMatrix4f.scale(new VecMath.SFVec3f(30, 30, 60)));
   
    objCow.md.transformMatrix = VecMath.SFMatrix4f.identity();
    objCow.md.transformMatrix = objCow.md.transformMatrix.mult(
            VecMath.SFMatrix4f.translation(new VecMath.SFVec3f(0.0, 0.75, 0.0)));
    objCow.md.transformMatrix = objCow.md.transformMatrix.mult(
            VecMath.SFMatrix4f.rotationY(MathHelper.DTR(-90.0)));
    objCow.md.transformMatrix = objCow.md.transformMatrix.mult(
           VecMath.SFMatrix4f.scale(new VecMath.SFVec3f(1, 1, 1))); 
   
    objCowSpec.md.transformMatrix = VecMath.SFMatrix4f.identity();
    objCowSpec.md.transformMatrix = objCowSpec.md.transformMatrix.mult(
            VecMath.SFMatrix4f.translation(new VecMath.SFVec3f(0.0, -0.75, 0.0)));
    objCowSpec.md.transformMatrix = objCowSpec.md.transformMatrix.mult(
            VecMath.SFMatrix4f.rotationY(MathHelper.DTR(-90.0)));
    objCowSpec.md.transformMatrix = objCowSpec.md.transformMatrix.mult(
           VecMath.SFMatrix4f.scale(new VecMath.SFVec3f(1, 1, 1))); 
   
    
    rotMat = VecMath.SFMatrix4f.rotationY(1 * dT);
    sceneOne.update(rotMat);
    
    angle -= 1; //* dT;
    var rad = Math.PI * angle / 180.0; // convert to rads
    meshData.cosA = Math.cos(rad);
    meshData.sinA = Math.sin(rad);
    meshData.trans.x = 1.0;
    meshData.trans.y = 0.0;
    meshData.scale.x = 1.0;
    meshData.scale.y = 1.0;

    // Note: matTrans is identity
    meshData.matT = VecMath.SFMatrix4f.translation(meshData.trans);
    meshData.matS = VecMath.SFMatrix4f.scale(meshData.scale);
    meshData.matR = VecMath.SFMatrix4f.rotationZ(rad);
 
    lastFrameTime = currentTime;
}

// Setup Buffer
function initBuffers() {
    // VertexPositionBuffer
    meshData.positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, meshData.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(meshData.vertices), gl.STATIC_DRAW);

    // VertexColorBuffer
    meshData.texBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, meshData.texBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(meshData.tex), gl.STATIC_DRAW);

    // IndexBuffer
    meshData.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, meshData.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(meshData.indices), gl.STATIC_DRAW);
}

// Setup texture
function initTexture() {
    tex = gl.createTexture();
    tex.image = new Image();
    tex.image.crossOrigin = ''; // ?
    tex.image.src = "tex2.png";
    tex.image.onload = function () {
        handleLoadedTexture(tex);
    };
}

// Handle texture
function handleLoadedTexture(texture) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.bindTexture(gl.TEXTURE_2D, null);
}

// Dispose all buffers and shaderProgram
function cleanUp() {

    // Free shader of drawables
    houseShader.dispose();
    secondPointerShader.dispose();
    houseShaderTex.dispose();
    secondPointerShader.dispose();
    minutePointerShader.dispose();
    hourPointerShader.dispose();
    boxShader.dispose();
    boxShaderTex.dispose();
    sphereShader.dispose();
    sphereShader1.dispose();

    // Free vertexShader
    gl.detachShader(shaderProgram, vertexShader);
    gl.deleteShader(vertexShader);

    // Free fragmentShader
    gl.detachShader(shaderProgram, fragmentShader);
    gl.deleteShader(fragmentShader);

    // Free program
    gl.deleteProgram(shaderProgram);
    shaderProgram = null;

    // Free buffers of drawable
    house.dispose();
    secondPointer.dispose();
    houseTex.dispose();
    secondPointer.dispose();
    minutePointer.dispose();
    hourPointer.dispose();
    box.dispose();
    boxTex.dispose();
    sphere.dispose();
    sphere1.dispose();

    // Free all buffers
    gl.deleteBuffer(meshData.positionBuffer);
    gl.deleteBuffer(meshData.texBuffer);
    gl.deleteBuffer(meshData.indexBuffer);

    // Free textures
    gl.deleteTexture(tex);
    
    // Scenes
    sceneOne.dispose();
    orientationScene.dispose();
}


// Controls KB
var currentlyPressedKeys = {};

function handleKeyDown(event) {
    currentlyPressedKeys[event.keyCode] = true;
}

function handleKeyUp(event) {
    currentlyPressedKeys[event.keyCode] = false;
}

var pitch = 0;
var pitchRate = 0;
var yaw = 0;
var yawRate = 0;
var xPos = 0;
var yPos = 0.4;
var zPos = 0;
var speed = 0;


function handleKeys() {
    if (currentlyPressedKeys[33]) {
        // Page Up
        pitchRate = 0.1;
    } else if (currentlyPressedKeys[34]) {
        // Page Down
        pitchRate = -0.1;
    } else {
        pitchRate = 0;
    }

    if (currentlyPressedKeys[37] || currentlyPressedKeys[65]) {
        // Left cursor key or A
        yawRate = 0.1;
    } else if (currentlyPressedKeys[39] || currentlyPressedKeys[68]) {
        // Right cursor key or D
        yawRate = -0.1;
    } else {
        yawRate = 0;
    }

    if (currentlyPressedKeys[38] || currentlyPressedKeys[87]) {
        // Up cursor key or W
        speed = 3.3;
    } else if (currentlyPressedKeys[40] || currentlyPressedKeys[83]) {
        // Down cursor key
        speed = -3.3;
    } else {
        speed = 0;
    }

}

var addVec = new VecMath.SFVec3f(0.0, 0.0, -5.0);

// Unser input and controls
function handleKeyboard(canvas, dT) {

    //canvas.setAttribute("tabindex", "0");
    canvas.addEventListener('keypress', function (evt) {
        switch (evt.charCode) {
            case 43: /* + */
                break;
            case 45: /* - */
                break;
        }
    }, true);
    canvas.addEventListener('keydown', function (evt) {
        switch (evt.keyCode) {
            // Move
            case 37: /* left */
                break;
            case 38: /* up */
                break;
            case 39: /* right */
                break;
            case 40: /* down */

                break;

                // Rotate
            case 65: /* a */
                angleY += -0.01 * dT;
                break;
            case 87: /* w */
                //angleX += 0.01 * dT;
                addVec.z -= 0.1 *dT;
                break;
            case 68: /* d */
                angleY += 0.01 * dT;
                break;
            case 83: /* s */
                addVec.z += 0.1 *dT;
               // angleX += -0.01 * dT;
                break;

        } 
    }, true);
   
    canvas.addEventListener('mousedown', handleMouseDown, true);
    canvas.addEventListener('mouseup', handleMouseUp, true);
    canvas.addEventListener('mousemove', handleMouseMove, true);
    
   
    
    //if (speed !== 0) {
        xPos -= Math.sin(MathHelper.DTR(yaw)) * speed * dT;
        zPos -= Math.cos(MathHelper.DTR(yaw)) * speed * dT;
    //}
    yPos = 0.0;
    
    yaw += yawRate * dT;
    pitch += pitchRate * dT;

    camPos.x = -xPos;
    camPos.y = -yPos;
    camPos.z = -zPos;


    viewMat = VecMath.SFMatrix4f.identity();
    viewMat = viewMat.mult(VecMath.SFMatrix4f.translation(camPos.add(new VecMath.SFVec3f(-xPos, 0.0, -7))));
    viewMat = viewMat.mult(VecMath.SFMatrix4f.rotationY(-yaw));
    viewMat = viewMat.mult(VecMath.SFMatrix4f.rotationX(-pitch));
    //viewMat = viewMat.mult(VecMath.SFMatrix4f.translation(camPos.add(new VecMath.SFVec3f(-xPos, 0.0, -7))));
    
   
    /*viewMat = VecMath.SFMatrix4f.identity();
    
    var rotMat = viewMat; 
    rotMat = rotMat.mult(VecMath.SFMatrix4f.rotationY(-yaw));
    rotMat = rotMat.mult(VecMath.SFMatrix4f.rotationX(-pitch));
    
    direction = rotMat.multMatrixPnt(addVec);
    //normalizedDirection = VecMath.SFVec3f.normalize(direction);
    
    viewMat = viewMat.mult(VecMath.SFMatrix4f.translation(direction));
    viewMat = viewMat.mult(VecMath.SFMatrix4f.rotationY(-yaw));
    viewMat = viewMat.mult(VecMath.SFMatrix4f.rotationX(-pitch));
    
    */
    // Dude define the look vector, move leftRight cross from position and look wa ma tryn 
    
    
    //console.log(pitch + " " + yaw + " " + camPos);
    //console.log(viewMat._03 + " " + viewMat._13 + " " +  viewMat._23);

    //console.log(moveVec);
    //console.log(viewMat);
}

function handleMouseDown(event){
    mouseDown = true;
    lastMouseX = event.layerX;
    lastMouseY = event.layerY;
}

function handleMouseUp(){
    mouseDown = false;
}

// http://learningwebgl.com/blog/?p=1253
function handleMouseMove(event){
    if(!mouseDown){
        return;
    }
    
    var newX = event.clientX;
    var newY = event.clientY;
    var turnSpeed = 0.9;

    var deltaX = (newX - lastMouseX) * turnSpeed;
    var deltaY = (newY - lastMouseY) * turnSpeed;
    //console.log(deltaX + " " + deltaY);
    
    mouseX = deltaX; mouseY = deltaY;
    
    yawRate = -mouseX; 
    pitchRate = -mouseY;
    
   // viewMat = viewMat.transpose();
   //viewMat = viewMat.mult(VecMath.SFMatrix4f.rotationY(MathHelper.DTR(deltaX))); 
    //viewMat = viewMat.mult(VecMath.SFMatrix4f.rotationX(MathHelper.DTR(deltaY)));
    
    lastMouseX = newX;
    lastMouseY = newY;  
}

// Setup perspective projection
function initProjection() {
    viewMat = VecMath.SFMatrix4f.translation(camPos).inverse();
    projectionMat = VecMath.SFMatrix4f.perspective(Math.PI / 4, 1.0, 0.1, 1000.0);
}




