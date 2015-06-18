// A small math extension
var MathHelper = function (){};

// Convert degrees to radians
MathHelper.DTR = function (angle){
   //return angle / 180.0 * Math.PI;
   return Math.PI / 180 * angle;
};

// Convert radians to degrees
MathHelper.RTD = function (rad){
    //return rad * 180 / Math.PI;
    return 180 / Math.PI * rad;
};

