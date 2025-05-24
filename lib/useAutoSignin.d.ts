import type { AuthContextProps } from "./AuthContext";
import type { AuthState } from "./AuthState";
type UseAutoSignInProps = {
    signinMethod?: keyof Pick<AuthContextProps, "signinRedirect" | "signinPopup">;
};
type UseAutoSignInReturn = Pick<AuthState, "isAuthenticated" | "isLoading" | "error">;
/**
 * @public
 *
 * Automatically attempts to sign in a user based on the provided sign-in method and authentication state.
 *
 * This hook manages automatic sign-in behavior for a user. It uses the specified sign-in
 * method, the current authentication state, and ensures the sign-in attempt is made only once
 * in the application context.
 *
 * Does not support the `signinResourceOwnerCredentials` method!
 *
 * @param options - (Optional) Configuration object for the sign-in method. Default to `{ signinMethod: "signinRedirect" }`.
 *       Possible values for `signinMethod` are:
 *        - `"signinRedirect"`: Redirects the user to the sign-in page (default).
 *        - `"signinPopup"`: Signs in the user through a popup.
 *
 * @returns The current status of the authentication process.
 */
export declare const useAutoSignin: ({ signinMethod }?: UseAutoSignInProps) => UseAutoSignInReturn;
export {};
//# sourceMappingURL=useAutoSignin.d.ts.map