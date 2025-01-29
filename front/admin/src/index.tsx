import { render } from "solid-js/web";
import image from "./test_admin_asset.png";

console.log("index.ts running");

const rootElement = document.getElementById("root");
if (rootElement) {
	render(() => <HelloWorld />, rootElement);
} else {
	console.error("root element not found");
}

function HelloWorld() {
	return (
		<div>
			Solid rendered
			<img src={image} alt="foo" />
		</div>
	);
}
