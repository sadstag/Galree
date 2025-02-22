import { render } from "solid-js/web";
import { Route, Router } from "@solidjs/router";
import { lazy } from "solid-js";
import { AuthPage } from "./pages/AuthPage";
import "./main.css";
import NotFound from "./pages/NotFound";
import { createStore } from "solid-js/store";
import { StoreContext } from "./store/StoreContext";
import { initialStore } from "./store/Store";
import "solid-devtools";
import { getGalreeFrontConfig } from "@frontCommon/config";

const rootElement = document.getElementById("root");
if (rootElement) {
	const AppPage = lazy(() => import("./pages/app/AppPage"));

	const [state, setState] = createStore(
		initialStore(getGalreeFrontConfig<"admin">()),
	);

	render(
		() => (
			<StoreContext.Provider value={{ state, setState }}>
				<Router>
					<Route path="/admin">
						<Route path="/" component={AuthPage} />
						<Route path="/in" component={AppPage} />
					</Route>
					<Route path="*" component={NotFound} />
				</Router>
			</StoreContext.Provider>
		),
		rootElement,
	);
} else {
	console.error("root element not found");
}
