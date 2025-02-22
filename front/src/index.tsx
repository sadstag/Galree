import { render } from "solid-js/web";
import { Route, Router } from "@solidjs/router";
import { lazy } from "solid-js";
import "./main.css";
import NotFound from "./pages/NotFound";
import { createStore } from "solid-js/store";
import { StoreContext } from "./store/StoreContext";
import { initialStore } from "./store/Store";
import "solid-devtools";
import { getGalreeFrontConfig } from "@config/config";
import { PublicPage } from "./pages/public/PublicPage";

const rootElement = document.getElementById("root");
if (rootElement) {
	const AuthPage = lazy(() => import("./pages/AuthPage"));
	const AdminPage = lazy(() => import("./pages/admin/AdminPage"));

	const [state, setState] = createStore(initialStore(getGalreeFrontConfig()));

	render(
		() => (
			<StoreContext.Provider value={{ state, setState }}>
				<Router>
					<Route path="/" component={PublicPage} />
					<Route path="/admin" component={AuthPage} />
					<Route path="/admin/in" component={AdminPage} />
					<Route path="*" component={NotFound} />
				</Router>
			</StoreContext.Provider>
		),
		rootElement,
	);
} else {
	console.error("root element not found");
}
