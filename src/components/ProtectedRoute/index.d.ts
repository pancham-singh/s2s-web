/// <reference types="react" />
export interface ProtectedRouteProps {
    component: any;
    canProceed: boolean;
    redirectToPath: string;
    exact?: boolean;
    path: string;
    onFail?: () => any;
}
declare const ProtectedRoute: ({ component: RouteComponent, canProceed, redirectToPath, onFail, ...rest }: ProtectedRouteProps) => JSX.Element;
export default ProtectedRoute;
