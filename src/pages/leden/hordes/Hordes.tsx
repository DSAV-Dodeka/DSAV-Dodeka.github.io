import PageTitle from "$components/PageTitle";
import { useSessionInfo, usePrivate } from "$functions/query.ts";
import { PrivateKeyNotSetError } from "$functions/backend.ts";
import HordesContent from "$content/Hordes.json";
import Horde from "./components/Horde";
import "./Hordes.scss";

type HordesJoinMap = Record<string, string>;

const Hordes = () => {
    const { data: session, isLoading: sessionLoading } = useSessionInfo();
    const loggedIn = !!session;
    const joinQuery = usePrivate<HordesJoinMap>("hordes_join", loggedIn);

    if (sessionLoading) {
        return (
            <>
                <PageTitle title="Hordes" />
                <p className="hordes_status">Laden...</p>
            </>
        );
    }

    if (!loggedIn) {
        return (
            <>
                <PageTitle title="Hordes" />
                <p className="hordes_status">
                    Deze pagina is helaas niet toegankelijk als je niet ingelogd bent. Log in om deze pagina te kunnen bekijken.
                </p>
            </>
        );
    }

    const joinMap: HordesJoinMap =
        joinQuery.error instanceof PrivateKeyNotSetError ? {} : (joinQuery.data ?? {});

    return (
        <>
            <PageTitle title="Hordes" />
            <div className="hordes_container">
                {HordesContent.hordes.map((horde, i) => {
                    const join = joinMap[horde.naam];
                    return (
                        <Horde
                            key={`${horde.naam}-${i}`}
                            {...horde}
                            {...(join ? { join } : {})}
                        />
                    );
                })}
            </div>
        </>
    );
};

export default Hordes;
