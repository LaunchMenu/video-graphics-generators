precision mediump float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform sampler2D originalSampler;
uniform vec3 highlightColor;

void main(void) {
    vec4 blurColor = texture2D(uSampler, vTextureCoord);
    vec4 originalColor = texture2D(originalSampler, vTextureCoord);

    gl_FragColor = blurColor * (1.0-originalColor.a) + vec4(highlightColor, 1) * originalColor.a;
}