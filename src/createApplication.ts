import {IAnimationSource} from "./_types/IAnimationSource";
import {GUI} from "dat.gui";
import {IAnimation} from "./_types/IAnimation";
import {autoDetectRenderer, Container} from "pixi.js";

/**
 * Creates the application that controls individual animations
 * @param animationSources The animations that can be chosen between
 */
export function createApplication(animationSources: IAnimationSource[]): void {
    // Setup GUI
    const gui = new GUI();
    const options = {
        /* Animation options */
        animation: animationSources[0].name,
        ["start recording"]: startRecording,
        preview: init,
    };

    const animationNames = animationSources.map(({name}) => name);
    gui.add(options, "animation", animationNames);
    gui.add(options, "preview");
    gui.add(options, "start recording");

    let animation: IAnimation | undefined;
    async function initAnimation() {
        const animationSource = animationSources.find(
            ({name}) => options.animation == name
        );
        if (animationSource) {
            if (animation) {
                if (animation.options) gui.removeFolder(animation.options);
                stage.removeChild(animation.scene);
            }

            renderer.resize(
                animation?.resolution?.width || 1920,
                animation?.resolution?.height || 1080
            );
            const scale = Math.min(
                window.innerWidth / renderer.width,
                window.innerHeight / renderer.height,
                1
            );
            renderer.view.style.zoom = `${scale}`;

            animation = await animationSource.init();
            stage.addChild(animation.scene);
            fps = animation.fps || 30;
            renderer.backgroundColor = animation.backgroundColor || 0;
        }
    }

    // Setup Pixi
    const renderer = autoDetectRenderer({
        width: 256,
        height: 256,
        antialias: true,
        transparent: false,
    });
    renderer.resize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.view);

    let fps = 30;
    const stage = new Container();
    let finished = true;
    let processingFrame = false;
    function update() {
        /* Loop this function */
        setTimeout(update, 1000 / fps);

        if (finished || processingFrame || !animation) return;
        processingFrame = true;

        animation?.step(1 / fps).then(async finished => {
            if (finished) stopRecording();

            /* Tell the `renderer` to `render` the `stage` */
            renderer.render(stage);

            /* Record Video */
            if (recorder) {
                recorder.resume();
                await new Promise(res => setTimeout(res, 1000 / fps));
                recorder.pause();
            }
            processingFrame = false;
        });
    }
    update();

    async function init() {
        if (!finished) return;
        await initAnimation();
        finished = false;
    }

    // Setup recorder
    let recorder: MediaRecorder | undefined;
    let chunks: Blob[];
    async function startRecording() {
        if (recorder) return;
        await init();
        chunks = [];
        const stream = (renderer.view as any).captureStream();
        recorder = new MediaRecorder(stream);

        recorder.addEventListener("dataavailable", ({data}) => chunks.push(data));

        recorder.start();
        recorder.pause();
        console.log("recording");
    }
    function stopRecording() {
        finished = true;
        if (!recorder) return;
        console.log("stopped recording");
        recorder.addEventListener("stop", () => {
            console.log("finished processing");
            const blob = new Blob(chunks);
            const a = document.createElement("a");
            document.body.appendChild(a);
            const url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = options.animation + ".webm";
            a.click();
            window.URL.revokeObjectURL(url);
        });
        recorder.stop();
        recorder = undefined;
    }
}
