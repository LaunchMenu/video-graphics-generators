import {Texture} from "pixi.js";
import {AnimationContainer} from "../../tools/animatables/AnimationContainer";
import {IAnimationSource} from "../../_types/IAnimationSource";
import {Line} from "./Line";
import {TransitionIn} from "../../tools/animatables/TransitionIn";
import {transitions} from "../../tools/animatables/transitions";
import {loadImages} from "../../tools/loadImages";
import {ease} from "../../tools/ease";
import {Icon} from "./Icon";
import {Sequence} from "../../tools/sequence/Sequence";
import {wait, waitUpdater} from "../../tools/sequence/wait";
import {IPoint} from "./_types/IPoint";
import {Camera} from "../../tools/camera/Camera";
import {CameraMove} from "../../tools/camera/CameraMove";
import {LineFilter} from "./filter/line/LinerFilter";
import {PathFollower} from "../../tools/camera/PathFollower";

import calendar from "./images/calendar.svg";
import chat from "./images/chat.svg";
import cloud from "./images/cloud.svg";
import cloudDone from "./images/cloudDone.svg";
import email from "./images/email.svg";
import folder from "./images/folder.svg";
import music from "./images/music.svg";
import people from "./images/people.svg";
import questionAndAnswer from "./images/questionAndAnswer.svg";
import translate from "./images/translate.svg";
import weather from "./images/weather.svg";
import user from "./images/user.svg";
import functions from "./images/functions.svg";

type IService = {
    texture: Texture;
    edge: IPoint[];
    pos: IPoint;
    offline?: boolean;
};

export const serviceGraphAnimation: IAnimationSource = {
    name: "Service graph",
    async init() {
        const images = await loadImages({
            chat,
            music,
            calendar,
            email,
            folder,
            translate,
            people,
            user,
            cloud,
            cloudDone,
            weather,
            questionAndAnswer,
            functions,
        });

        const scene = new AnimationContainer();

        const userData = {
            texture: images.user,
            pos: {x: 960, y: 950},
            size: 300,
            color: 0x35a3f7,
        };
        const userYPos = userData.pos.y - userData.size / 2;
        const serviceWidth = 100;
        const services = {
            chat: {
                texture: images.chat,
                pos: {x: 150, y: 150},
                edge: [
                    {x: 730, y: 150},
                    {x: 730, y: 490},
                    {x: 910, y: 490},
                    {x: 910, y: userYPos},
                ],
            },
            calendar: {
                texture: images.calendar,
                pos: {x: 250, y: 550},
                edge: [
                    {x: 870, y: 550},
                    {x: 870, y: userYPos},
                ],
            },
            people: {
                texture: images.people,
                pos: {x: 450, y: 300},
                edge: [
                    {x: 710, y: 300},
                    {x: 710, y: 510},
                    {x: 890, y: 510},
                    {x: 890, y: userYPos},
                ],
            },
            weather: {
                texture: images.weather,
                pos: {x: 600, y: 700},
                edge: [
                    {x: 850, y: 700},
                    {x: 850, y: userYPos},
                ],
            },
            cloudDone: {
                texture: images.cloudDone,
                pos: {x: 750, y: 75},
                edge: [
                    {x: 750, y: 470},
                    {x: 930, y: 470},
                    {x: 930, y: userYPos},
                ],
            },
            music: {
                texture: images.music,
                pos: {x: 850, y: 400},
                edge: [
                    {x: 950, y: 400},
                    {x: 950, y: userYPos},
                ],
                offline: true,
            },
            functions: {
                texture: images.functions,
                pos: {x: 1050, y: 150},
                edge: [
                    {x: 970, y: 150},
                    {x: 970, y: userYPos},
                ],
                offline: true,
            },
            questionAndAnswer: {
                texture: images.questionAndAnswer,
                pos: {x: 1250, y: 350},
                edge: [
                    {x: 1010, y: 350},
                    {x: 1010, y: userYPos},
                ],
            },
            email: {
                texture: images.email,
                pos: {x: 1300, y: 100},
                edge: [
                    {x: 1120, y: 100},
                    {x: 1120, y: 220},
                    {x: 990, y: 220},
                    {x: 990, y: userYPos},
                ],
            },
            folder: {
                texture: images.folder,
                pos: {x: 1500, y: 650},
                edge: [
                    {x: 1070, y: 650},
                    {x: 1070, y: userYPos},
                ],
                offline: true,
            },
            cloud: {
                texture: images.cloud,
                pos: {x: 1600, y: 350},
                edge: [
                    {x: 1340, y: 350},
                    {x: 1340, y: 440},
                    {x: 1050, y: 440},
                    {x: 1050, y: userYPos},
                ],
            },
            translate: {
                texture: images.translate,
                pos: {x: 1800, y: 250},
                edge: [
                    {x: 1320, y: 250},
                    {x: 1320, y: 420},
                    {x: 1030, y: 420},
                    {x: 1030, y: userYPos},
                ],
            },
            user: userData,
        };

        // Setup the icons
        const iconsContainer = new AnimationContainer();
        scene.addChild(iconsContainer);

        const icons = Object.values(services).map(
            data =>
                new TransitionIn({
                    item: new Icon({
                        color: "offline" in data && data.offline ? 0x999999 : 0x777799,
                        size: serviceWidth,
                        ...data,
                    }),
                    duration: 1500,
                    type: transitions.scaleCenter,
                    easing: ease.inElastic,
                })
        );
        iconsContainer.addChild(...icons);

        // Setup the edges
        const edgeContainer = new AnimationContainer();
        const transitionEdgeIn = new TransitionIn({
            item: edgeContainer,
            type: transitions.fade,
            duration: 2000,
        });
        scene.addChild(transitionEdgeIn);
        edgeContainer.filters = [
            new LineFilter({color: 0x35a3f7, blurQuality: 30, blurStrength: 40}),
        ];

        const edges = Object.values(services)
            .filter((data): data is IService => "edge" in data)
            .map(data => {
                const dx = data.edge[0].x - data.pos.x;
                const dy = data.edge[0].y - data.pos.y;
                return new Line({
                    points: [
                        {
                            x:
                                data.pos.x +
                                ((dx > 0 ? 1 : dx < 0 ? -1 : 0) * serviceWidth) / 2,
                            y:
                                data.pos.y +
                                ((dy > 0 ? 1 : dy < 0 ? -1 : 0) * serviceWidth) / 2,
                        },
                        ...data.edge,
                    ],
                    color: 0x0e4bf1,
                    width: 6,
                    duration: 8000,
                    data: {
                        speed: 300,
                        showTransDuration: 300,
                    },
                    easing: ease.inOutDegree(1.4, 2),
                });
            });
        edgeContainer.addChild(...edges);

        // Animate the camera
        const width = 1920,
            height = 1080;
        const camera = new Camera({
            target: scene,
            size: {width, height},
        });

        const panRight = new PathFollower({
            camera,
            duration: 11000,
            points: [
                {x: 200, y: 400, zoom: 1.7},
                {x: 1400, y: 400, zoom: 1.3},
            ],
            easing: ease.inOutDegree(1.4),
        });
        const zoomOut = new CameraMove({
            camera,
            duration: 8000,
            point: () => ({x: width / 2, y: height / 2, zoom: 1}),
            easing: ease.inOutQuad,
        });
        scene.addChild(camera);

        // Setup the animation sequence
        const seq = wait(500)
            .next(
                panRight,
                Sequence.chain(...icons.map(icon => Sequence.timed(icon, 800)))
            )
            .next(zoomOut, transitionEdgeIn, ...edges)
            .next(wait(10000));
        seq.start();
        let finished = false;
        seq.finished.then(() => {
            finished = true;
        });

        return {
            scene,
            step: async delta => {
                await waitUpdater.step(delta);
                await scene.step(delta);
                return finished;
            },
            backgroundColor: 0xffffff,
        };
    },
};
