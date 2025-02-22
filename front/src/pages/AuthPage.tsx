import { createSignal, Show, useContext } from "solid-js";
import styles from "./AuthPage.module.css";
import { useNavigate, usePreloadRoute } from "@solidjs/router";
import {
	requestAccessToken,
	type AccessTokenRequestResponse,
} from "./google/identity";
import { StoreContext } from "../store/StoreContext";
import { produce } from "solid-js/store";

type AuthOutcomeError = {
	outcome: "error";
	error: Error;
};

type AuthOutcomeUnexpectedUser = {
	outcome: "unexpected_user";
} & AccessTokenRequestResponse;

type AuthOutcome =
	| { outcome: "unauthenticated" }
	| AuthOutcomeError
	| AuthOutcomeUnexpectedUser;

function authOutcomeAsError(
	outcome: AuthOutcome,
): AuthOutcomeError | undefined {
	if (outcome.outcome === "error") return outcome as AuthOutcomeError;
}

function authOutcomeAsUnexpectedUser(
	outcome: AuthOutcome,
): AuthOutcomeUnexpectedUser | undefined {
	if (outcome.outcome === "unexpected_user")
		return outcome as AuthOutcomeUnexpectedUser;
}

const AuthPage = () => {
	const navigate = useNavigate();
	const preload = usePreloadRoute();
	const { state, setState } = useContext(StoreContext);

	const [authOutcome, setAuthOutcome] = createSignal<AuthOutcome>({
		outcome: "unauthenticated",
	});

	function handleMouseOverSigninButton() {
		preload(
			"/admin/in",
			// { preloadData: true } ?
		);
	}

	const handleClick = async () => {
		let response: AccessTokenRequestResponse;
		try {
			response = await requestAccessToken(state.config.appClientId);
		} catch (e) {
			setAuthOutcome({ outcome: "error", error: e as Error });
			return;
		}

		if (
			await isExpectedUser(
				response.userInfo.email,
				state.config.hashed_siteAdminGoogleAccount,
				state.config.hashSalt,
			)
		) {
			setState(
				produce((state) => {
					state.accessToken = response.accessToken;
					state.userInfo = response.userInfo;
				}),
			);
			navigate("/admin/in");
		} else {
			setAuthOutcome({
				outcome: "unexpected_user",
				...response,
			});
		}
	};

	return (
		<div class={styles.auth_page}>
			<Show when={authOutcome().outcome === "unauthenticated"}>
				<h1>Welcome where you know you are</h1>
				<div
					id="sign_in"
					class={styles.sign_in_button}
					onMouseOver={handleMouseOverSigninButton}
					onFocus={handleMouseOverSigninButton}
				/>
				<button
					type="button"
					onClick={handleClick}
					onMouseOver={handleMouseOverSigninButton}
					onFocus={handleMouseOverSigninButton}
				>
					Who's there ?
				</button>
			</Show>
			<Show when={authOutcome().outcome === "unexpected_user"}>
				<>
					<div>
						Signed in as{" "}
						{authOutcomeAsUnexpectedUser(authOutcome())?.userInfo.email}
					</div>
					<p>
						You were not expected. Maybe you have several google account and did
						not select the right one to authenticate ?
					</p>
					<button
						type="button"
						id="signOutButton"
						onClick={() => {
							setAuthOutcome({ outcome: "unauthenticated" });
						}}
					>
						Sign out
					</button>
				</>
			</Show>
			<Show when={authOutcome().outcome === "error"}>
				<p>Sign in error: {authOutcomeAsError(authOutcome())?.error.message}</p>
			</Show>
		</div>
	);
};

export async function isExpectedUser(
	email: string,
	expectedUserHash: string,
	hashSalt: string,
): Promise<boolean> {
	function buf2hex(buffer: ArrayBuffer) {
		return [...new Uint8Array(buffer)]
			.map((x) => x.toString(16).padStart(2, "0"))
			.join("");
	}

	const identityEmailHash = buf2hex(
		await window.crypto.subtle.digest(
			"SHA-256",
			new TextEncoder().encode(email + hashSalt),
		),
	);

	return expectedUserHash === identityEmailHash;
}

export default AuthPage;
