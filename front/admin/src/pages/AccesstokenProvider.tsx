import type { AccessTokenRequestResponse } from "./google/identity";
import {
	createSignal,
	useContext,
	createContext,
	type ParentProps,
	type Accessor,
} from "solid-js";

// TODO put in store

const AuthContext = createContext<
	[
		Accessor<AccessTokenRequestResponse | null | undefined>,
		(accessToken: AccessTokenRequestResponse | null) => void,
	]
>([() => null, () => {}]);

export function AccesstokenProvider(props: ParentProps) {
	const [accessToken, setAccessToken] =
		createSignal<AccessTokenRequestResponse | null>();

	return (
		<AuthContext.Provider value={[accessToken, setAccessToken]}>
			{props.children}
		</AuthContext.Provider>
	);
}

export function useAccessToken() {
	return useContext(AuthContext)[0];
}

export function useAccessTokenRW() {
	return useContext(AuthContext);
}
