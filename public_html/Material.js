/* global VecMath */

"use strict";

var Material = function(){
    this.Ka = new VecMath.SFVec3f(0.1, 0.1, 0.1);
    this.Kd = new VecMath.SFVec3f(0.7, 0.7, 0.7);
    this.Ks = new VecMath.SFVec3f(1.0, 1.0, 1.0);
    this.diffuseTexturePath = null;
};

Material.prototype.setAmbientColor = function(Ka){
    this.Ka = Ka;
};

Material.prototype.setDiffuseColor = function(Kd){
    this.Kd = Kd;
};

Material.prototype.setSpecularColor = function(Ks){
    this.Ks = Ks;
};

// TODO : set Ka, Kd, Ks, diffTexPath
Material.prototype.readMaterialFromMTL = function(path){
};