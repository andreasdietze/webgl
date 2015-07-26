varying vec3 vColor;
// forwarded diffuse lighting
varying vec3 vLighting; 
void main() {
   vec4 texelColor = vec4(vColor, 1.0);
   gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
}