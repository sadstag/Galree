import { render } from "solid-js/web";
import { Route, Router } from "@solidjs/router";
import { lazy } from "solid-js";
import { AuthPage } from "./pages/AuthPage";

const rootElement = document.getElementById("root");
if (rootElement) {
	const DatasourcePage = lazy(() => import("./pages/DatasourcePage"));
	const ImagesPage = lazy(() => import("./pages/ImagesPage"));
	const NotFound = lazy(() => import("./pages/NotFound"));

	render(
		() => (
			<Router>
				<Route path="/" component={AuthPage} />
				<Route path="/datasource" component={DatasourcePage} />
				<Route path="/images" component={ImagesPage} />
				<Route path="*" component={NotFound} />
			</Router>
		),
		rootElement,
	);
} else {
	console.error("root element not found");
}
