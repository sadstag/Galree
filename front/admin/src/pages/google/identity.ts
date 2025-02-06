const scope = [
    // "https://www.googleapis.com/auth/spreadsheets.readonly",
    "https://www.googleapis.com/auth/userinfo.email",
    // getting user name
    "https://www.googleapis.com/auth/userinfo.profile",
    // reading and writing to user part of the bucket
    "https://www.googleapis.com/auth/devstorage.read_write",
    "openid",
].join(" ");

let GIS_loaded = false;
async function loadGoogleIdentityServiceScript(): Promise<void> {
    if (GIS_loaded) return;
    return new Promise((resolve, reject) => {
        const timer = window.setTimeout(reject, 2000);
        const script = document.createElement("script");
        script.async = false;
        script.src = "https://accounts.google.com/gsi/client";
        script.onload = () => {
            window.clearTimeout(timer);
            GIS_loaded = true;
            resolve();
        };
        document.head.appendChild(script);
    });
}

export type AccessTokenRequestResponse = {
    accessToken: string;
    userInfo: UserInfo;
};

export async function requestAccessToken(
    client_id: string,
): Promise<AccessTokenRequestResponse> {
    await loadGoogleIdentityServiceScript();

    const tokenResponse = await new Promise<
        google.accounts.oauth2.TokenResponse
    >((resolve, reject) => {
        // TODO timeout ?
        const tokenClient = google.accounts.oauth2.initTokenClient({
            client_id,
            scope,
            callback: resolve,
        });
        tokenClient.requestAccessToken();
    });

    const accessToken = tokenResponse.access_token;
    return {
        accessToken,
        userInfo: await getUserInfo(accessToken),
    };
}

type UserInfo = {
    sub: string; // user id

    email: string;
    email_verified: boolean;

    name: string; // complete name
    family_name: string;
    given_name: string;

    picture: string; // url to profile image
};

async function getUserInfo(accessToken: string): Promise<UserInfo> {
    const response = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
            headers: {
                "Authorization": `Bearer ${accessToken}`,
            },
        },
    );
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return response.json();
}
