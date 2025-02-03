import { createEffect, onCleanup, useContext } from "solid-js";
import styles from "./Header.module.css";
import logo from "./logo_text.svg";
import { AuthContext } from "../AuthContext";
import { logout } from "../auth";
import { useNavigate } from "@solidjs/router";

export const Header = () => {
	const navigate = useNavigate();
	const identity = useContext(AuthContext);

	const handleClickOnLogout = () => {
		logout();
		navigate("/admin");
	};

	let headerRef!: HTMLDivElement;
	let hue = 60;
	let animation: number;
	createEffect(() => {
		animation = window.setInterval(() => {
			hue += 5;
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
					src={identity?.picture}
					alt="User pictural representation"
					crossorigin="anonymous"
					fetchpriority="low"
				/>
				<span>{identity?.name}</span>
				<a href="/admin" onclick={handleClickOnLogout}>
					Logout
				</a>
			</div>
		</header>
	);
};
