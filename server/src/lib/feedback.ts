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

const SEP_LINE_DIE = '!'.repeat(80);

export function stepBegins(message: string) {
	info('>>>>> ' + message);
}

export function stepEnds(message: string) {
	success('<<<<< ' + message + '\n');
}

export function die(message: string) {
	error('\n' + SEP_LINE_DIE);
	error(message);
	error(SEP_LINE_DIE);
	Deno.exit(1);
}
