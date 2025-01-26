import { color } from '@nandi/color';

export function info(message: string) {
	color(message, 'white');
}

export function success(message: string) {
	color(message, 'green');
}

export function error(message: string) {
	color(message, 'red');
}
