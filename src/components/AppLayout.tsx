import { ReactNode } from "react";
import Sidebar from "./Sidebar";

interface AppLayoutProps {
    children: ReactNode;
    scrollable?: boolean;
}

const AppLayout = ({ children, scrollable = false }: AppLayoutProps) => {   return (
        <div
            style={{
                display: "flex",
                height: "100vh",

                background: "#f4f6f4",
                fontFamily: "'DM Sans', sans-serif",
            }}
        >
            <Sidebar />
            <main
                style={{
                    flex: 1,
                    padding: "32px 36px",
                    background: "#f4f6f4",
                    overflow: scrollable ? "auto" : "hidden",
                }}
            >
                {children}
            </main>
        </div>
    );
};

export default AppLayout;