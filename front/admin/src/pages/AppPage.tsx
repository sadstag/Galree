import styles from "./AppPage.module.css";
import { Header } from "./layout/Header";
import { useNavigate } from "@solidjs/router";
import { AuthContext } from "./AuthContext";
import { getIndentity } from "./auth";
import { createSignal, For } from "solid-js";

const Tabs = ["Catalog", "Images"] as const;

const AppPage = () => {
	const navigate = useNavigate();

	const identity = getIndentity();

	if (!identity) {
		console.warn(
			"in /admin/in and no claimed identity, redirecting to /admin...",
		);
		navigate("/admin");
		return;
	}

	const [selectedTab, setSelectedTab] =
		createSignal<(typeof Tabs)[number]>("Catalog");

	return (
		<AuthContext.Provider value={identity}>
			<article class={styles.app_page}>
				<Header />
				<div class={styles.content}>
					<nav>
						<For each={Tabs}>
							{(tab) => (
								<Navitem
									label={tab}
									selected={selectedTab() === tab}
									onSelect={() => setSelectedTab(tab)}
								/>
							)}
						</For>
					</nav>
				</div>
			</article>
		</AuthContext.Provider>
	);
};

type NavitemProps = {
	label: string;
	selected: boolean;
	onSelect: () => void;
};
const Navitem = (props: NavitemProps) => {
	return (
		<div
			classList={{ [styles.selected]: props.selected }}
			onClick={props.onSelect}
			onKeyPress={props.onSelect}
		>
			{props.label}
		</div>
	);
};

export default AppPage;
