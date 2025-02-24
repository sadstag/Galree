import { createSignal, Show } from "solid-js";
import styles from "./PublicDBLoadingError.module.css";

type Props = {
	error: Error;
	refetch: () => void;
};

export const PublicDBLoadingError = (props: Props) => {
	const [show, setShow] = createSignal(true);

	return (
		<Show when={show()}>
			<div class={styles.panel}>
				<p>
					Could not load public database. If you never generated it, this is
					perfectly normal, just ignore the message.
					<br />
					Otherwise, it will only affect comparisons between public and private
					database, but you can still go on.
				</p>
				<button type="button" onClick={props.refetch}>
					Retry fetching public database
				</button>
				<button type="button" onClick={() => setShow(false)}>
					x
				</button>
			</div>
		</Show>
	);
};
