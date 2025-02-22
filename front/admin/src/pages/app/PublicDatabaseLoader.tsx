import { createResource, Match, Suspense, Switch } from "solid-js";
import type { PublicDatabase } from "../../store/Store";

export const PublicDatabaseLoader = () => {
	const [db] = createResource<PublicDatabase>(async () => {
		const response = await fetch(
			"https://storage.googleapis.com/galree-public/essad/db.json",
		);
		if (!response.ok) {
			throw "could not fetch";
		}
		return response.json();
	});
	return (
		<Suspense fallback={<div>Loading ...</div>}>
			{" "}
			<Switch>
				<Match when={db.error}>Error loading public db : {db.error}</Match>
				<Match when={db()}>Downlaod public db</Match>
			</Switch>
		</Suspense>
	);
};
