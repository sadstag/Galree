import { error } from './feedback.ts';

export function die(message: string) {
	error(message);
	Deno.exit(1);
}
