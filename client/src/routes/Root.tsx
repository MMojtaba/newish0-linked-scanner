import { Outlet, useNavigate } from "react-router-dom";

import BottomNav from "@components/BottomNav";
import { useGlobalPeer } from "@hooks/useGlobalPeer";

import PrepConnectionLoader from "@components/loaders/PrepConnection";
import { useEffect } from "react";
import { ConnectionMetadata } from "@shared/type/peer";
import { useAppSettings } from "@atoms/appsettings";

export default function Root() {
    const navigate = useNavigate();
    const [appSettings, setAppSettings] = useAppSettings();

    // Init connection
    const { localPeer, connections } = useGlobalPeer({ verbose: true });

    useEffect(() => {
        if (localPeer) navigate("/home");
    }, [navigate, localPeer]);

  

    if (!localPeer) {
        return (
            <div className="h-screen flex items-center">
                <PrepConnectionLoader />
            </div>
        );
    }

    return (
        <>
            <div className="w-screen h-screen fixed flex flex-col">
                <main className="overflow-auto h-full">
                    <Outlet />
                </main>

                <BottomNav />
            </div>
        </>
    );
}
