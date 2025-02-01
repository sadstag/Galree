import { render } from "solid-js/web";
import { Route, Router } from "@solidjs/router";
import { lazy } from "solid-js";
import { AuthPage } from "./pages/AuthPage";
import "./main.css";
import NotFound from "./pages/NotFound";

const rootElement = document.getElementById("root");
if (rootElement) {
	const AppPage = lazy(() => import("./pages/AppPage"));

	render(
		() => (
			<Router>
				<Route path="/admin">
					<Route path="/" component={AuthPage} />
					<Route path="/in" component={AppPage} />
				</Route>
				<Route path="*" component={NotFound} />
			</Router>
		),
		rootElement,
	);
} else {
	console.error("root element not found");
}
