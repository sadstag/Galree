export const CONFIG_FILE = '../galree.jsonc';
export const DOCKER_IMAGE_FILESYSTEM_TEMP_DIR = './docker-image-filesystem';

export const FRONT_ASSETS_FOLDER = '../front/dist/assets';
export const FRONT_HTML_TEMPLATE_FILE = '../front/dist/index.html';

export const DOCKER_IMAGE_BASENAME = 'galree';

export const ARTWORKS_FOLDER_NAME = 'artworks';

export function getDockerImageName(dev: boolean) {
	return DOCKER_IMAGE_BASENAME + (dev ? '-dev' : '');
}
