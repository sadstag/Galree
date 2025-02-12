import { createSignal, Show, useContext } from "solid-js";
import styles from "./AuthPage.module.css";
import { useNavigate, usePreloadRoute } from "@solidjs/router";
import {
	requestAccessToken,
	type AccessTokenRequestResponse,
} from "./google/identity";
import { getGalreeConfig } from "./config";
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

export const AuthPage = () => {
	const navigate = useNavigate();
	const preload = usePreloadRoute();
	const { setState } = useContext(StoreContext);

	const [authOutcome, setAuthOutcome] = createSignal<AuthOutcome>({
		outcome: "unauthenticated",
	});

	/*************  ✨ Codeium Command ⭐  *************/
	/**
	 * Handle mouse over event of the "Sign in" button.
	 *
	 * This will preload the /admin/in page, which will do the actual authentication.
	 *
	 * @remarks
	 * The reason we don't do the actual authentication here is because the authentication
	 * needs to happen in a context where the user can be redirected to the authentication
	 * page, and after authentication, the user needs to be redirected back to the
	 * /admin/in page. This is hard to do from here because we don't have a way to redirect
	 * the user to a different page from here.
	 */
	/******  bd6a59d2-c968-42eb-98c5-7e3ebc7d9bab  *******/
	function handleMouseOverSigninButton() {
		preload(
			"/admin/in",
			// { preloadData: true } ?
		);
	}

	const handleClick = async () => {
		let response: AccessTokenRequestResponse;
		try {
			response = await requestAccessToken(getGalreeConfig().appClientId);
		} catch (e) {
			setAuthOutcome({ outcome: "error", error: e as Error });
			return;
		}

		if (await isExpectedUser(response.userInfo.email)) {
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

export async function isExpectedUser(email: string): Promise<boolean> {
	const { hashed_siteAdminGoogleAccount, hashSalt } = getGalreeConfig();

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

	return hashed_siteAdminGoogleAccount === identityEmailHash;
}
