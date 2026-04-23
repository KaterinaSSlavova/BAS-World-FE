import { ReactNode } from "react";
import Sidebar from "./Sidebar";

interface AppLayoutProps {
    children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
    return (
        <div
            style={{
                display: "flex",
                minHeight: "100vh",
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
                    overflow: "auto",
                }}
            >
                {children}
            </main>
        </div>
    );
};

export default AppLayout;