import type { ErrorContext } from "./AuthState";
/**
 * @public
 */
export declare const hasAuthParams: (location?: Location) => boolean;
export declare const signinError: (error: unknown) => ErrorContext;
export declare const signoutError: (error: unknown) => ErrorContext;
export declare const renewSilentError: (error: unknown) => ErrorContext;
export declare function normalizeError(error: unknown, fallbackMessage: string): Pick<ErrorContext, "name" | "message" | "innerError" | "stack">;
//# sourceMappingURL=utils.d.ts.map