import styles from "./AppPage.module.css";
import { Header } from "../layout/Header";
import { useNavigate } from "@solidjs/router";
import { AuthContext } from "../AuthContext";
import { getIndentity } from "../auth";
import { createSignal, For, lazy, type Component } from "solid-js";
import { Dynamic } from "solid-js/web";
import CatalogPage from "./subpages/catalog/CatalogPage";

const Tabs = ["Catalog", "Images"] as const;
type Tab = (typeof Tabs)[number];

const contentComponents: { [tab in Tab]: Component } = {
	Catalog: CatalogPage, // seelcted by default, can be bundled with AppPage
	Images: lazy(() => import("./subpages/images/ImagesPage")),
};

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

	const [selectedTab, setSelectedTab] = createSignal<Tab>("Catalog");

	return (
		<AuthContext.Provider value={identity}>
			<article class={styles.app_page}>
				<Header />
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
				<div class={styles.content}>
					<Dynamic component={contentComponents[selectedTab()]} />
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
