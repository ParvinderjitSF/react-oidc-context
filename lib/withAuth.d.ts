import React from "react";
import type { AuthContextProps } from "./AuthContext";
/**
 * A public higher-order component to access the imperative API
 * @public
 */
export declare function withAuth<P>(Component: React.ComponentType<P>): React.ComponentType<Omit<P, keyof AuthContextProps>>;
//# sourceMappingURL=withAuth.d.ts.map