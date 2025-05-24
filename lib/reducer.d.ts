import type { User } from "oidc-client-ts";
import type { AuthState, ErrorContext } from "./AuthState";
type Action = {
    type: "INITIALISED" | "USER_LOADED";
    user: User | null;
} | {
    type: "USER_UNLOADED";
} | {
    type: "USER_SIGNED_OUT";
} | {
    type: "NAVIGATOR_INIT";
    method: NonNullable<AuthState["activeNavigator"]>;
} | {
    type: "NAVIGATOR_CLOSE";
} | {
    type: "ERROR";
    error: ErrorContext;
};
/**
 * Handles how that state changes in the `useAuth` hook.
 */
export declare const reducer: (state: AuthState, action: Action) => AuthState;
export {};
//# sourceMappingURL=reducer.d.ts.map