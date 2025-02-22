import { createContext } from "solid-js";
import type { State } from "./Store";
import type { SetStoreFunction } from "solid-js/store";

type StoreContextData = { state: State; setState: SetStoreFunction<State> };

export const StoreContext = createContext<
    StoreContextData
>({ state: {} as State, setState: () => {} }, { name: "StoreContext" });
