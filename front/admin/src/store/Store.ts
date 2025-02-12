import type { UserInfo } from "../pages/google/identity";

export type State = {
    artworks: Artwork[];
    accessToken: string;
    userInfo: UserInfo;
};

type Artwork = {
    id: string;
};

export const initialStore: State = {
    artworks: [],
    accessToken: "",
    userInfo: {
        sub: "",
        email: "",
        email_verified: false,
        name: "",
        family_name: "",
        given_name: "",
        picture: "",
    },
};
