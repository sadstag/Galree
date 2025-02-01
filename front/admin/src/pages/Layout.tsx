import type { ParentProps } from "solid-js";

export const Layout = (props: ParentProps) => {
	return (
		<div>
			<div>Layout</div>
			{props.children}
		</div>
	);
};
