import styles from "./AdminPage.module.css";
import { Header } from "./layout/Header";
import { useNavigate } from "@solidjs/router";
import {
	createSignal,
	For,
	lazy,
	Suspense,
	useContext,
	type Component,
} from "solid-js";
import { Dynamic } from "solid-js/web";
import CatalogPage from "./subpages/catalog/CatalogPage";
import { StoreContext } from "../../store/StoreContext";
import { PublicDatabaseLoader } from "./PublicDatabaseLoader";

const Tabs = ["Catalog", "Images"] as const;
type Tab = (typeof Tabs)[number];

const contentComponents: { [tab in Tab]: Component } = {
	Catalog: CatalogPage, // seelcted by default, can be bundled with AppPage
	Images: lazy(() => import("./subpages/images/ImagesPage")),
};

const AdminPage = () => {
	const navigate = useNavigate();

	const { state } = useContext(StoreContext);

	if (!state.user) {
		console.warn("in /admin/in and no access token, redirecting to /admin...");
		navigate("/admin");
		return;
	}

	const [selectedTab, setSelectedTab] = createSignal<Tab>("Catalog");

	return (
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
			<Suspense fallback={<div>Loading ...</div>}>
				<PublicDatabaseLoader>
					<div class={styles.content}>
						<Dynamic component={contentComponents[selectedTab()]} />
					</div>
				</PublicDatabaseLoader>
			</Suspense>
		</article>
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

export default AdminPage;
