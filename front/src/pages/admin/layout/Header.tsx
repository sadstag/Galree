import { createEffect, createSignal, onCleanup, useContext } from "solid-js";
import styles from "./Header.module.css";
import logo from "./logo_text.svg";
import { useNavigate } from "@solidjs/router";
import { StoreContext } from "../../../store/StoreContext";
import { formatDistance } from "date-fns";

export const Header = () => {
	const navigate = useNavigate();
	const { state } = useContext(StoreContext);

	if (!state.user) {
		console.error("Impossible state: user is not defined");
		navigate("/admin");
		return;
	}

	const computeTimeLeft = () =>
		formatDistance(state.user?.expiresAt || 0, Date.now(), {
			includeSeconds: true,
		});

	const [timeLeft, setTimeLeft] = createSignal(computeTimeLeft());

	const logout = () => {
		if (import.meta.env.DEV) {
			window.localStorage.removeItem("user");
		}
		navigate("/admin");
	};

	let headerRef!: HTMLDivElement;
	let hue = 60;
	let animation: number;
	createEffect(() => {
		animation = window.setInterval(() => {
			if ((state.user?.expiresAt || 0) - Date.now() < 0) {
				console.log("Access token expired, logging out.");
				logout();
				return;
			}
			console.log(computeTimeLeft());
			setTimeLeft(computeTimeLeft());
			hue++;
			headerRef.style.backgroundColor = `hsl(${hue}, 100%, 90%)`;
		}, 5000);
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
				{
					// deactivated (HTTP 429 too many requests) we would have to store the image somewhrere for this to be usable
					/* <img
					src={state.userInfo.picture}
					alt="User pictural representation"
					crossorigin="anonymous"
					fetchpriority="low"
				/> */
				}
				<span>
					Logged in as <b>{state.user.info.name}</b> ({state.user.info.email}),{" "}
					{timeLeft()} before auto-logout
				</span>
				<a href="/admin" onclick={logout}>
					Logout
				</a>
			</div>
		</header>
	);
};
