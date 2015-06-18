/* global VecMath */

// Create cube chain
var cubeChain = new Array(); 

// Create sphere chain
var sphereChain = new Array();

var MultipleObjects = function(gl, mh) {
    //this.cubeChain = new Array();
    //this.sphereChain = new Array();
    
    // Create the chain
    createCubeChain(gl, mh);
    
    // Create the chain
    createSphereChain(gl, mh);   
};

//MultipleObjects.prototype.createCubeChain = function(gl, mh){
function createCubeChain(gl, mh){
    var shader = new ColorShader();
    var drawable;

    for(var i = 0; i < 8; i++){
        drawable = new ColorDrawable();
        mh.setupBox(0.25);
        shader.initGL(gl);
        shader.initShader(mh.vss, mh.fss);
        drawable.initGL(gl);

        // Set random colors
        var colors = new Array(
        // front
        Math.floor(Math.random() * 2), Math.floor(Math.random() * 2), Math.floor(Math.random() * 2),
        Math.floor(Math.random() * 2), Math.floor(Math.random() * 2), Math.floor(Math.random() * 2),
        Math.floor(Math.random() * 2), Math.floor(Math.random() * 2), Math.floor(Math.random() * 2),
        Math.floor(Math.random() * 2), Math.floor(Math.random() * 2), Math.floor(Math.random() * 2),
        // back
        Math.floor(Math.random() * 2), Math.floor(Math.random() * 2), Math.floor(Math.random() * 2),
        Math.floor(Math.random() * 2), Math.floor(Math.random() * 2), Math.floor(Math.random() * 2),
        Math.floor(Math.random() * 2), Math.floor(Math.random() * 2), Math.floor(Math.random() * 2),
        Math.floor(Math.random() * 2), Math.floor(Math.random() * 2), Math.floor(Math.random() * 2)
        );

        drawable.setBufferData(mh.mesh.vertices,
                colors,
                mh.mesh.indices,
                mh.mesh.trans,
                mh.mesh.cosA,
                mh.mesh.sinA);

        var vec = new VecMath.SFVec3f(-3.5 + i, -2, 0);

        drawable.md.transformMatrix._03 = vec.x;
        drawable.md.transformMatrix._13 = vec.y;
        drawable.md.transformMatrix._23 = vec.z;

        cubeChain[i] = drawable;
        console.log("Added to cubeChain: " + cubeChain[i] + 
                    " x: " + cubeChain[i].md.transformMatrix._03 +
                    " y: " + cubeChain[i].md.transformMatrix._13 + 
                    " z; " + cubeChain[i].md.transformMatrix._23);
    }
}

//MultipleObjects.prototype.createSphereChain = function(gl, mh){
function createSphereChain(gl, mh){
    var shader = new ColorShader();
    var drawable;

    for(var i = 0; i < 8; i++){
        drawable = new ColorDrawable();
        mh.setupSphere(0.4, Math.floor(Math.random() * 4));
        shader.initGL(gl);
        shader.initShader(mh.vss, mh.fss);
        drawable.initGL(gl);

        drawable.setBufferData(mh.mesh.vertices,
                mh.mesh.col,
                mh.mesh.indices,
                mh.mesh.trans,
                mh.mesh.cosA,
                mh.mesh.sinA);

        var vec = new VecMath.SFVec3f(-3.5 + i, -3, 0);

        drawable.md.transformMatrix._03 = vec.x;
        drawable.md.transformMatrix._13 = vec.y;
        drawable.md.transformMatrix._23 = vec.z;

        sphereChain[i] = drawable;
        console.log("Added to sphereChain: " + sphereChain[i] + 
                    " x: " + sphereChain[i].md.transformMatrix._03 +
                    " y: " + sphereChain[i].md.transformMatrix._13 + 
                    " z; " + sphereChain[i].md.transformMatrix._23);
    }
}

MultipleObjects.prototype.draw = function(boxShader, sphereShader, viewMat, projectionMat){
    for(var i = 0; i < cubeChain.length; i++)
    cubeChain[i].draw(boxShader.sp, viewMat, projectionMat);

    for(var i = 0; i < sphereChain.length; i++)
    sphereChain[i].draw(sphereShader.sp, viewMat, projectionMat);   
};

MultipleObjects.prototype.update = function(rotMat){
    for(var i = 0; i < cubeChain.length; i++)
        cubeChain[i].md.transformMatrix = cubeChain[i].md.transformMatrix.mult(rotMat);

    for(var i = 0; i < sphereChain.length; i++)
        sphereChain[i].md.transformMatrix = sphereChain[i].md.transformMatrix.mult(rotMat);
};

MultipleObjects.prototype.dispose = function(){
    for(var i = 0; i < cubeChain.length; i++)
        cubeChain[i].dispose();
    
    for(var i = 0; i < sphereChain.length; i++)
        sphereChain[i].dispose();
    
};