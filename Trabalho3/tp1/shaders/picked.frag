#ifdef GL_ES
precision highp float;
#endif

uniform float normScale;
varying vec4 coords;
varying vec4 normal;
uniform sampler2D uSampler;
varying vec2 vTextureCoord;

void main() {
	vec4 color = texture2D(uSampler, vTextureCoord);

	color.r = color.r + (1.0 - color.r)*normScale;
	color.g = color.g + (0.0 - color.g)*normScale;
	color.b = color.b + (0.0 - color.b)*normScale;

	gl_FragColor = color;
}