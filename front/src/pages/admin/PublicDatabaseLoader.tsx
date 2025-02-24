import {
	createEffect,
	createResource,
	Show,
	useContext,
	type ParentProps,
} from "solid-js";
import type { PublicDatabase } from "../../store/Store";
import { StoreContext } from "../../store/StoreContext";
import { produce } from "solid-js/store";
import { PublicDBLoadingError } from "./PublicDBLoadingError";

type Props = ParentProps;

export const PublicDatabaseLoader = (props: Props) => {
	const { state, setState } = useContext(StoreContext);
	const [db, { refetch: refetchPublicDB }] = createResource<PublicDatabase>(
		async () => {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			const response = await fetch(state.URLs.PUBLIC_DATABASE);
			if (!response.ok) {
				throw Error("could not fetch");
			}
			return response.json();
		},
	);

	createEffect(() => {
		if (db()) {
			// biome-ignore lint/suspicious/noAssignInExpressions: biome does not understand immer logic
			// biome-ignore lint/style/noNonNullAssertion: biome does not know that db() always return the smae thing in this context
			setState(produce((state) => (state.publicDatabase = db()!)));
		}
	});

	return (
		<>
			<Show when={db.error}>
				<PublicDBLoadingError error={db.error} refetch={refetchPublicDB} />
			</Show>
			{props.children}
		</>
	);
};
