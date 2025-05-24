import React from "react";
import type { SigninRedirectArgs } from "oidc-client-ts";
/**
 * @public
 */
export interface WithAuthenticationRequiredProps {
    /**
     * Show a message when redirected to the signin page.
     */
    OnRedirecting?: () => React.JSX.Element;
    /**
     * Allows executing logic before the user is redirected to the signin page.
     */
    onBeforeSignin?: () => Promise<void> | void;
    /**
     * Pass additional signin redirect arguments.
     */
    signinRedirectArgs?: SigninRedirectArgs;
}
/**
 * A public higher-order component to protect accessing not public content. When you wrap your components in this higher-order
 * component and an anonymous user visits your component, they will be redirected to the login page; after logging in, they
 * will return to the page from which they were redirected.
 *
 * @public
 */
export declare const withAuthenticationRequired: <P extends object>(Component: React.ComponentType<P>, options?: WithAuthenticationRequiredProps) => React.FC<P>;
//# sourceMappingURL=withAuthenticationRequired.d.ts.map