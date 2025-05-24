import type { QuerySessionStatusArgs } from 'oidc-client-ts';
import { default as React_2 } from 'react';
import type { RevokeTokensTypes } from 'oidc-client-ts';
import type { SessionStatus } from 'oidc-client-ts';
import type { SigninPopupArgs } from 'oidc-client-ts';
import type { SigninRedirectArgs } from 'oidc-client-ts';
import type { SigninResourceOwnerCredentialsArgs } from 'oidc-client-ts';
import type { SigninSilentArgs } from 'oidc-client-ts';
import type { SignoutPopupArgs } from 'oidc-client-ts';
import type { SignoutRedirectArgs } from 'oidc-client-ts';
import type { SignoutResponse } from 'oidc-client-ts';
import type { SignoutSilentArgs } from 'oidc-client-ts';
import { User } from 'oidc-client-ts';
import { UserManager } from 'oidc-client-ts';
import type { UserManagerEvents } from 'oidc-client-ts';
import { UserManagerSettings } from 'oidc-client-ts';

/**
 * @public
 */
export declare const AuthContext: React_2.Context<AuthContextProps | undefined>;

/**
 * @public
 */
export declare interface AuthContextProps extends AuthState {
    /**
     * UserManager functions. See [UserManager](https://github.com/authts/oidc-client-ts) for more details.
     */
    readonly settings: UserManagerSettings;
    readonly events: UserManagerEvents;
    clearStaleState(): Promise<void>;
    removeUser(): Promise<void>;
    signinPopup(args?: SigninPopupArgs): Promise<User>;
    signinSilent(args?: SigninSilentArgs): Promise<User | null>;
    signinRedirect(args?: SigninRedirectArgs): Promise<void>;
    signinResourceOwnerCredentials(args: SigninResourceOwnerCredentialsArgs): Promise<User>;
    signoutRedirect(args?: SignoutRedirectArgs): Promise<void>;
    signoutPopup(args?: SignoutPopupArgs): Promise<void>;
    signoutSilent(args?: SignoutSilentArgs): Promise<void>;
    querySessionStatus(args?: QuerySessionStatusArgs): Promise<SessionStatus | null>;
    revokeTokens(types?: RevokeTokensTypes): Promise<void>;
    startSilentRenew(): void;
    stopSilentRenew(): void;
}

export declare const AuthProvider: (props: AuthProviderProps) => React_2.JSX.Element;

export declare interface AuthProviderBaseProps {
    children?: React_2.ReactNode;
    onSigninCallback?: (user: User | undefined) => Promise<void> | void;
    skipSigninCallback?: boolean;
    matchSignoutCallback?: (args: UserManagerSettings) => boolean;
    onSignoutCallback?: (resp: SignoutResponse | undefined) => Promise<void> | void;
    onRemoveUser?: () => Promise<void> | void;
}

export declare interface AuthProviderNoUserManagerProps extends AuthProviderBaseProps, UserManagerSettings {
    userManager?: never;
}

export declare type AuthProviderProps = AuthProviderNoUserManagerProps | AuthProviderUserManagerProps;

export declare interface AuthProviderUserManagerProps extends AuthProviderBaseProps {
    userManager?: UserManager;
}

/**
 * The auth state which, when combined with the auth methods, make up the return object of the `useAuth` hook.
 *
 * @public
 */
export declare interface AuthState {
    /**
     * See [User](https://authts.github.io/oidc-client-ts/classes/User.html) for more details.
     */
    user?: User | null;
    /**
     * True when the library has been initialized and no navigator request is in progress.
     */
    isLoading: boolean;
    /**
     * True while the user has a valid access token.
     */
    isAuthenticated: boolean;
    /**
     * Tracks the status of most recent signin/signout request method.
     */
    activeNavigator?: "signinRedirect" | "signinResourceOwnerCredentials" | "signinPopup" | "signinSilent" | "signoutRedirect" | "signoutPopup" | "signoutSilent";
    /**
     * Was there a signin or silent renew error?
     */
    error?: ErrorContext;
}

/**
 * Represents an error while execution of a signing, renew, ...
 *
 * @public
 */
export declare type ErrorContext = Error & {
    innerError?: unknown;
} & ({
    source: "signinCallback";
} | {
    source: "signoutCallback";
} | {
    source: "renewSilent";
} | {
    source: "signinPopup";
    args: SigninPopupArgs | undefined;
} | {
    source: "signinSilent";
    args: SigninSilentArgs | undefined;
} | {
    source: "signinRedirect";
    args: SigninRedirectArgs | undefined;
} | {
    source: "signinResourceOwnerCredentials";
    args: SigninResourceOwnerCredentialsArgs | undefined;
} | {
    source: "signoutPopup";
    args: SignoutPopupArgs | undefined;
} | {
    source: "signoutRedirect";
    args: SignoutRedirectArgs | undefined;
} | {
    source: "signoutSilent";
    args: SignoutSilentArgs | undefined;
} | {
    source: "unknown";
});

/**
 * @public
 */
export declare const hasAuthParams: (location?: Location) => boolean;

/**
 * @public
 */
export declare const useAuth: () => AuthContextProps;

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

declare type UseAutoSignInProps = {
    signinMethod?: keyof Pick<AuthContextProps, "signinRedirect" | "signinPopup">;
};

declare type UseAutoSignInReturn = Pick<AuthState, "isAuthenticated" | "isLoading" | "error">;

/**
 * A public higher-order component to access the imperative API
 * @public
 */
export declare function withAuth<P>(Component: React_2.ComponentType<P>): React_2.ComponentType<Omit<P, keyof AuthContextProps>>;

/**
 * A public higher-order component to protect accessing not public content. When you wrap your components in this higher-order
 * component and an anonymous user visits your component, they will be redirected to the login page; after logging in, they
 * will return to the page from which they were redirected.
 *
 * @public
 */
export declare const withAuthenticationRequired: <P extends object>(Component: React_2.ComponentType<P>, options?: WithAuthenticationRequiredProps) => React_2.FC<P>;

/**
 * @public
 */
export declare interface WithAuthenticationRequiredProps {
    /**
     * Show a message when redirected to the signin page.
     */
    OnRedirecting?: () => React_2.JSX.Element;
    /**
     * Allows executing logic before the user is redirected to the signin page.
     */
    onBeforeSignin?: () => Promise<void> | void;
    /**
     * Pass additional signin redirect arguments.
     */
    signinRedirectArgs?: SigninRedirectArgs;
}

export { }
