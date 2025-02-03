import { getGalreeConfig } from "./config";

export type SignedInGoogleIndentityInfo = {
    email: string;
    name: string;
    picture: string; // URL of profile image
    iat: number; // JWT issued at (timestamp)
    exp: number; // JWT expiration (timestamp)
};

/**
 * Set front state for user logged in
 * This is called after google sign in button API tells users had sign in
 * After this function is called, from the front app point of view it only mean the user prentends to have this identity
 * it does not mean anything else
 * The user will be directed to the front admin internal pages, and then google cloud platform will ensure that API calls are really legit, or not
 * So if the user is just pretending to be some identity and set the front state manually, GCP will reject
 */
export function login(identity: SignedInGoogleIndentityInfo) {
    window.sessionStorage.setItem(
        "claimedGoogleIdentity",
        JSON.stringify(identity),
    );
    // console.log(identity);
}

export function logout() {
    window.sessionStorage.removeItem("claimedGoogleIdentity");
}

export function getIndentity(): SignedInGoogleIndentityInfo | undefined {
    const claimedIdentity = window.sessionStorage.getItem(
        "claimedGoogleIdentity",
    );
    return claimedIdentity ? JSON.parse(claimedIdentity) : undefined;
}

export async function isExpectedGoogleIdentity(
    identity: SignedInGoogleIndentityInfo,
): Promise<boolean> {
    const { hashed_siteAdminGoogleAccount, hashSalt } = getGalreeConfig();

    function buf2hex(buffer: ArrayBuffer) {
        return [...new Uint8Array(buffer)]
            .map((x) => x.toString(16).padStart(2, "0"))
            .join("");
    }

    const identityEmailHash = buf2hex(
        await window.crypto.subtle.digest(
            "SHA-256",
            new TextEncoder().encode(
                identity.email + hashSalt,
            ),
        ),
    );

    return hashed_siteAdminGoogleAccount === identityEmailHash;
}
