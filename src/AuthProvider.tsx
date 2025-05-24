import type {
    ProcessResourceOwnerPasswordCredentialsArgs,
    SignoutResponse,
} from "oidc-client-ts";
import { User, UserManager, type UserManagerSettings } from "oidc-client-ts";
import React from "react";

import { AuthContext } from "./AuthContext";
import { type ErrorContext, initialAuthState } from "./AuthState";
import { reducer } from "./reducer";
import {
    hasAuthParams,
    normalizeError,
    renewSilentError,
    signinError,
    signoutError,
} from "./utils";

export interface AuthProviderBaseProps {
    children?: React.ReactNode;
    onSigninCallback?: (user: User | undefined) => Promise<void> | void;
    skipSigninCallback?: boolean;
    matchSignoutCallback?: (args: UserManagerSettings) => boolean;
    onSignoutCallback?: (
        resp: SignoutResponse | undefined
    ) => Promise<void> | void;
    onRemoveUser?: () => Promise<void> | void;
}

export interface AuthProviderNoUserManagerProps
    extends AuthProviderBaseProps,
        UserManagerSettings {
    userManager?: never;
}

export interface AuthProviderUserManagerProps extends AuthProviderBaseProps {
    userManager?: UserManager;
}

export type AuthProviderProps =
    | AuthProviderNoUserManagerProps
    | AuthProviderUserManagerProps;

const userManagerContextKeys = [
    "clearStaleState",
    "querySessionStatus",
    "revokeTokens",
    "startSilentRenew",
    "stopSilentRenew",
] as const;
const navigatorKeys = [
    "signinPopup",
    "signinSilent",
    "signinRedirect",
    "signinResourceOwnerCredentials",
    "signoutPopup",
    "signoutRedirect",
    "signoutSilent",
] as const;
const unsupportedEnvironment = (fnName: string) => () => {
    throw new Error(
        `UserManager#${fnName} was called from an unsupported context. If this is a server-rendered page, defer this call with useEffect() or pass a custom UserManager implementation.`
    );
};

const UserManagerImpl = typeof window === "undefined" ? null : UserManager;

export const AuthProvider = (props: AuthProviderProps): React.JSX.Element => {
    const {
        children,
        onSigninCallback,
        skipSigninCallback,
        matchSignoutCallback,
        onSignoutCallback,
        onRemoveUser,
        userManager: userManagerProp = null,
        ...userManagerSettings
    } = props;

    const userManagerRef = React.useRef<UserManager | null>(null);
    const createdInternally = React.useRef<boolean>(false);

    if (!userManagerRef.current) {
        if (userManagerProp) {
            userManagerRef.current = userManagerProp;
            createdInternally.current = false;
        } else {
            userManagerRef.current = UserManagerImpl
                ? new UserManagerImpl(
                      userManagerSettings as UserManagerSettings
                  )
                : ({ settings: userManagerSettings } as UserManager);
            createdInternally.current = true;
        }
    }

    const userManager = userManagerRef.current!;
    const [state, dispatch] = React.useReducer(reducer, initialAuthState);

    const userManagerContext = React.useMemo(
        () =>
            Object.assign(
                {
                    settings: userManager.settings,
                    events: userManager.events,
                },
                Object.fromEntries(
                    userManagerContextKeys.map((key) => [
                        key,
                        userManager[key]?.bind(userManager) ??
                            unsupportedEnvironment(key),
                    ])
                ) as Pick<UserManager, (typeof userManagerContextKeys)[number]>,
                Object.fromEntries(
                    navigatorKeys.map((key) => [
                        key,
                        userManager[key]
                            ? async (
                                  args: ProcessResourceOwnerPasswordCredentialsArgs &
                                      never[]
                              ) => {
                                  dispatch({
                                      type: "NAVIGATOR_INIT",
                                      method: key,
                                  });
                                  try {
                                      return await userManager[key](args);
                                  } catch (error) {
                                      dispatch({
                                          type: "ERROR",
                                          error: {
                                              ...normalizeError(
                                                  error,
                                                  `Unknown error while executing ${key}(...).`
                                              ),
                                              source: key,
                                              args,
                                          } as ErrorContext,
                                      });
                                      return null;
                                  } finally {
                                      dispatch({ type: "NAVIGATOR_CLOSE" });
                                  }
                              }
                            : unsupportedEnvironment(key),
                    ])
                ) as Pick<UserManager, (typeof navigatorKeys)[number]>
            ),
        [userManager]
    );

    const didInitialize = React.useRef(false);

    React.useEffect(() => {
        if (!userManager || didInitialize.current) return;
        didInitialize.current = true;

        void (async () => {
            try {
                let user: User | undefined | null = null;

                if (hasAuthParams() && !skipSigninCallback) {
                    user = await userManager.signinCallback();
                    if (onSigninCallback) await onSigninCallback(user);
                }

                user = user ?? (await userManager.getUser());
                dispatch({ type: "INITIALISED", user });
            } catch (error) {
                dispatch({ type: "ERROR", error: signinError(error) });
            }

            try {
                if (matchSignoutCallback?.(userManager.settings)) {
                    const resp = await userManager.signoutCallback();
                    if (onSignoutCallback) await onSignoutCallback(resp);
                }
            } catch (error) {
                dispatch({ type: "ERROR", error: signoutError(error) });
            }
        })();
    }, [
        userManager,
        skipSigninCallback,
        onSigninCallback,
        onSignoutCallback,
        matchSignoutCallback,
    ]);

    React.useEffect(() => {
        const handleUserLoaded = (user: User) =>
            dispatch({ type: "USER_LOADED", user });
        const handleUserUnloaded = () => dispatch({ type: "USER_UNLOADED" });
        const handleUserSignedOut = () => dispatch({ type: "USER_SIGNED_OUT" });
        const handleSilentRenewError = (error: Error) =>
            dispatch({ type: "ERROR", error: renewSilentError(error) });

        userManager.events.addUserLoaded(handleUserLoaded);
        userManager.events.addUserUnloaded(handleUserUnloaded);
        userManager.events.addUserSignedOut(handleUserSignedOut);
        userManager.events.addSilentRenewError(handleSilentRenewError);

        return () => {
            userManager.events.removeUserLoaded(handleUserLoaded);
            userManager.events.removeUserUnloaded(handleUserUnloaded);
            userManager.events.removeUserSignedOut(handleUserSignedOut);
            userManager.events.removeSilentRenewError(handleSilentRenewError);

            if (createdInternally.current) {
                userManager.stopSilentRenew?.();
                userManager.clearStaleState?.();
            }
        };
    }, [userManager]);

    const removeUser = React.useCallback(async () => {
        if (!userManager) unsupportedEnvironment("removeUser");
        await userManager.removeUser();
        if (onRemoveUser) await onRemoveUser();
    }, [userManager, onRemoveUser]);

    const contextValue = React.useMemo(() => {
        return {
            ...state,
            ...userManagerContext,
            removeUser,
        };
    }, [state, userManagerContext, removeUser]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
