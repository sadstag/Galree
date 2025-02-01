import { createSignal, onMount, Show } from "solid-js";
import { jwtDecode } from "jwt-decode";
import styles from "./AuthPage.module.css";

import {
	isExpectedGoogleIdentity,
	login,
	logout,
	type SignedInGoogleIndentityInfo,
} from "./auth";
import { useNavigate, usePreloadRoute } from "@solidjs/router";

const googleSignInScript = document.createElement("script");
googleSignInScript.async = false;
googleSignInScript.src = "https://accounts.google.com/gsi/client";
document.head.appendChild(googleSignInScript);

// no 'authenticated_expected_identity' because in tat case we redirect to app 'private' part
type AuthState = {
	type: "unauthenticated" | "authenticated_unexpected_identity";
	identityInfo?: SignedInGoogleIndentityInfo;
};

export const AuthPage = () => {
	const navigate = useNavigate();
	const preload = usePreloadRoute();

	const [authState, setAuthState] = createSignal<AuthState>({
		type: "unauthenticated",
	});

	function handleMouseOverSigninButton() {
		preload(
			"/admin/in",
			// { preloadData: true } ?
		);
	}

	function handleCredentialResponse(
		response: google.accounts.id.CredentialResponse,
	) {
		const identityInfo = jwtDecode(
			response.credential,
		) as SignedInGoogleIndentityInfo;

		isExpectedGoogleIdentity(identityInfo).then((isExpected) => {
			if (isExpected) {
				login(identityInfo);
				navigate("/admin/in");
			} else {
				setAuthState({
					type: "authenticated_unexpected_identity",
					identityInfo,
				});
			}
		});
	}

	onMount(() => {
		let retry = 0;
		const checkGoogleSignInLoaded = window.setInterval(() => {
			if (window.google) {
				window.clearInterval(checkGoogleSignInLoaded);
				// @ts-ignore
				google.accounts.id.initialize({
					client_id:
						"263035609611-r5dtcum05k53388dt78l705228j3m9dv.apps.googleusercontent.com",
					callback: handleCredentialResponse,
					auto_select: false,
				});
				window.google.accounts.id.renderButton(
					// biome-ignore lint/style/noNonNullAssertion: the button will be there in onMount()
					document.getElementById("sign_in")!,
					{
						type: "standard",
						locale: "en-US",
						theme: "outline",
						size: "medium",
						text: "signin",
					},
				);
				google.accounts.id.storeCredential;
				google.accounts.id.prompt();

				// TODO redirect to another page
				// then display name, picture
				// check that email correspond to site admin account
				// welcome or sorry
				// sorry : propose log in with another account
				console.log("in checkGoogleSignInLoaded");
			} else if (retry > 10) {
				window.clearInterval(checkGoogleSignInLoaded);
				// TODO display error in page and ask reload
				console.error("could not load google sign in script");
			} else {
				console.log("will retry");
				retry++;
			}
		}, 200);
	});

	return (
		<div class={styles.auth_page}>
			<Show when={authState().type === "unauthenticated"}>
				<h1>Welcome where you know you are</h1>
				<div
					id="sign_in"
					class={styles.sign_in_button}
					onMouseOver={handleMouseOverSigninButton}
					onFocus={handleMouseOverSigninButton}
				/>
			</Show>
			<Show when={authState().type === "authenticated_unexpected_identity"}>
				<>
					<div>Signed in as {authState().identityInfo?.email}</div>
					<p>
						You were not expected. Maybe you have several google account and did
						not select the right one to authenticate ?
					</p>
					<button
						type="button"
						id="signOutButton"
						onClick={() => {
							logout();
							window.location.reload();
						}}
					>
						Sign out
					</button>
				</>
			</Show>
		</div>
	);
};
