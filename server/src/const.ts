export const CONFIG_FILE = '../galree.jsonc';
export const DOCKER_IMAGE_FILESYSTEM_TEMP_DIR = './docker-image-filesystem';

export const PUBLIC_FRONT_ASSETS_FOLDER = '../front/public/dist/assets';
export const PUBLIC_FRONT_HTML_TEMPLATE_FILE =
	'../front/public/dist/index.html';

export const ADMIN_FRONT_HTML_TEMPLATE_FILE = '../front/admin/dist/index.html';
export const ADMIN_FRONT_ASSETS_FOLDER = '../front/admin/dist/admin_assets';

export const DOCKER_IMAGE_BASENAME = 'galree';

export const ARTWORKS_FOLDER_NAME = 'artworks';

export function getDockerImageName(dev: boolean) {
	return DOCKER_IMAGE_BASENAME + (dev ? '-dev' : '');
}
