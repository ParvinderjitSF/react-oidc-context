import type { SignoutResponse } from "oidc-client-ts";
import { User, UserManager, type UserManagerSettings } from "oidc-client-ts";
import React from "react";
export interface AuthProviderBaseProps {
    children?: React.ReactNode;
    onSigninCallback?: (user: User | undefined) => Promise<void> | void;
    skipSigninCallback?: boolean;
    matchSignoutCallback?: (args: UserManagerSettings) => boolean;
    onSignoutCallback?: (resp: SignoutResponse | undefined) => Promise<void> | void;
    onRemoveUser?: () => Promise<void> | void;
}
export interface AuthProviderNoUserManagerProps extends AuthProviderBaseProps, UserManagerSettings {
    userManager?: never;
}
export interface AuthProviderUserManagerProps extends AuthProviderBaseProps {
    userManager?: UserManager;
}
export type AuthProviderProps = AuthProviderNoUserManagerProps | AuthProviderUserManagerProps;
export declare const AuthProvider: (props: AuthProviderProps) => React.JSX.Element;
//# sourceMappingURL=AuthProvider.d.ts.map