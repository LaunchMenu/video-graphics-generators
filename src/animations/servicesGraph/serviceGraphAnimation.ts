import {Container, Graphics, Loader, Sprite, Texture} from "pixi.js";
import {AnimationContainer} from "../../tools/animatables/AnimationContainer";
import {IAnimationSource} from "../../_types/IAnimationSource";
import {Line} from "./Line";
import {LineSegment} from "./LineSegment";
import {TransitionIn} from "../../tools/animatables/TransitionIn";
import {transitions} from "../../tools/animatables/transitions";
import {loadImages} from "../../tools/loadImages";
import {ease} from "../../tools/ease";
import {Icon} from "./Icon";
import {Sequence} from "../../tools/sequence/Sequence";
import {wait} from "../../tools/sequence/wait";

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
import {IPoint} from "./_types/IPoint";
import {Camera} from "../../tools/camera/Camera";

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
            pos: {x: 960, y: 900},
            size: 200,
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
            music: {
                texture: images.music,
                pos: {x: 850, y: 400},
                edge: [
                    {x: 950, y: 400},
                    {x: 950, y: userYPos},
                ],
                offline: true,
            },
            calendar: {
                texture: images.calendar,
                pos: {x: 250, y: 550},
                edge: [
                    {x: 870, y: 550},
                    {x: 870, y: userYPos},
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
            folder: {
                texture: images.folder,
                pos: {x: 1500, y: 650},
                edge: [
                    {x: 1070, y: 650},
                    {x: 1070, y: userYPos},
                ],
                offline: true,
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
            cloudDone: {
                texture: images.cloudDone,
                pos: {x: 750, y: 75},
                edge: [
                    {x: 750, y: 470},
                    {x: 930, y: 470},
                    {x: 930, y: userYPos},
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
            questionAndAnswer: {
                texture: images.questionAndAnswer,
                pos: {x: 1250, y: 350},
                edge: [
                    {x: 1010, y: 350},
                    {x: 1010, y: userYPos},
                ],
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
            user: userData,
        };

        // Setup the icons
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
        scene.addChild(...icons);

        // Setup the edges
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
                    // speed: 100,
                    duration: 10000,
                    easing: ease.outCubic,
                });
            });
        scene.addChild(...edges);

        // Animate the camera
        const width = 1920,
            height = 1080;
        const follow = [0, 3, 6];
        const camera = new Camera({
            target: scene,
            size: {width, height},
            paths: {
                zoomOut: {
                    points: [
                        {...[...edges[follow[2]].points].reverse()[0], zoom: 2},
                        {x: width / 2, y: height / 2, zoom: 1},
                    ],
                    duration: 3000,
                    easing: ease.inOutCubic,
                },
                followLine: {
                    targets: [
                        {
                            target: edges[follow[0]],
                            duration: 2000,
                            zoom: 2,
                        },
                        {
                            target: edges[follow[1]],
                            duration: 2000,
                            zoom: 2,
                        },
                        {
                            target: edges[follow[2]],
                            duration: 4500,
                            zoom: 2,
                        },
                    ],
                },
            },
        });
        scene.addChild(camera);

        // Setup the animation sequence
        wait(500)
            .next(Sequence.chain(...icons.map(icon => Sequence.timed(icon, 600))))
            .next(wait(1000))
            .next(
                camera.paths.followLine.next(camera.paths.zoomOut),
                wait(300).next(...edges)
            )
            .next(wait(500))
            .start();

        return {
            scene,
            step: delta => scene.step(delta),
            backgroundColor: 0xffffff,
        };
    },
};
