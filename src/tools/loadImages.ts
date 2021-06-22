import {Loader, Resource, Texture, utils} from "pixi.js";

/**
 * Loads the images from the specified paths
 * @param paths The paths of the images to load
 * @returns The image textures
 */
export function loadImages<T extends Record<string, string>>(
    paths: T
): Promise<{[K in keyof T]: Texture<Resource>}> {
    return new Promise((res, rej) => {
        const loader = new Loader();
        utils.clearTextureCache();

        Object.entries(paths).forEach(([name, path]) => {
            loader.add(name, path);
        });

        loader.onError.add(rej);
        loader.onComplete.add(() => {
            res(
                Object.fromEntries(
                    Object.entries(loader.resources).map(([name, value]) => [
                        name,
                        value.texture,
                    ])
                ) as {[K in keyof T]: Texture<Resource>}
            );
        });
        loader.load();
    });
}
