import { createEffect, onCleanup, useContext } from "solid-js";
import styles from "./Header.module.css";
import logo from "./logo_text.svg";
import { useNavigate } from "@solidjs/router";
import { StoreContext } from "../../../store/StoreContext";

export const Header = () => {
	const navigate = useNavigate();
	const { state } = useContext(StoreContext);

	const handleClickOnLogout = () => {
		//accessToken()?.revoke();
		navigate("/admin");
	};

	let headerRef!: HTMLDivElement;
	let hue = 60;
	let animation: number;
	createEffect(() => {
		animation = window.setInterval(() => {
			hue++;
			headerRef.style.backgroundColor = `hsl(${hue}, 100%, 90%)`;
		}, 1000);
	});

	onCleanup(() => {
		window.clearInterval(animation);
	});

	return (
		<header class={styles.header} ref={headerRef}>
			<img
				class={styles.logo}
				src={logo}
				alt="Galree logo"
				fetchpriority="low"
			/>
			<div class={styles.user}>
				<img
					src={state.userInfo.picture}
					alt="User pictural representation"
					crossorigin="anonymous"
					fetchpriority="low"
				/>
				<span>{state.userInfo.name}</span>
				<a href="/admin" onclick={handleClickOnLogout}>
					Logout
				</a>
			</div>
		</header>
	);
};
