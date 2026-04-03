import { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";

interface AppLayoutProps {
    children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
    const [active, setActive] = useState("Dashboard");

    return (
        <div className="flex min-h-screen">
            <Sidebar active={active} setActive={setActive} />
            <main className="flex-1 ml-64 p-8">
                {children}
            </main>
        </div>
    );
};

export default AppLayout;