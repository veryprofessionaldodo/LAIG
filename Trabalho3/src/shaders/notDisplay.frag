#ifdef GL_ES
precision highp float;
#endif

uniform float normScale;
varying vec4 coords;
varying vec4 normal;
uniform sampler2D uSampler;
varying vec2 vTextureCoord;

void main(){
	discard;
}