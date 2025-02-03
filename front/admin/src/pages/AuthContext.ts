import { createContext } from "solid-js";
import type { SignedInGoogleIndentityInfo } from "./auth";

export const AuthContext = createContext<SignedInGoogleIndentityInfo>();
