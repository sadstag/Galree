export const CONFIG_FILE = '../galree.jsonc';
export const DOCKER_IMAGE_FILESYSTEM_TEMP_DIR = './docker-image-filesystem';

export const PUBLIC_FRONT_HTML_TEMPLATE_FILE = '../front/public/index.html';
export const ADMIN_FRONT_HTML_TEMPLATE_FILE = '../front/admin/index.html';

export const DOCKER_IMAGE_BASENAME = 'galree';

export function getDockerImageName(dev: boolean) {
	return DOCKER_IMAGE_BASENAME + (dev ? '-dev' : '');
}
