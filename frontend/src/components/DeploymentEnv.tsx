import { useState } from 'react';

const DeploymentEnv = () => {

    const [version, setVersion] = useState("");

    const appEnv = import.meta.env.VITE_APP_ENV;

    // console.log(appEnv);

    if (appEnv === "undefined") {
        return null;
    }

    const deployTime = import.meta.env.VITE_DEPLOY_TIME;

    if (appEnv === "development") {
        return (
            <div className="fixed bottom-2.5 right-2.5 text-red-600 decoration-8 px-3 py-1.5 rounded z-50 text-right">
                TREK <b>DEV</b> ENV <br />
                <div className="text-sm">
                    <b>Last Deployed: {deployTime}</b> <br />
                    <b>Do NOT share development environment publicly</b>
                </div>
            </div>
        );
    }

    if (appEnv === "beta") {

        // fetch version number
        fetch('https://ubc-cpsc455-2024s.github.io/trekkers-docs-public/version.json')
            .then(response => response.json())
            .then(data => {
                setVersion(data.version);
            })
            .catch(error => {
                console.error('Error fetching the JSON version:', error);
            });

        return (
            <>
                <div className="fixed bottom-2.5 right-2.5 text-red-600 decoration-8 px-3 py-1.5 rounded z-50 text-right">
                    TREK <b>BETA</b> v{version}<br />
                    <div className="text-sm"><b>Unauthorized distribution or reproduction is prohibited</b></div>
                </div>
            </>

        );
    }

};

export default DeploymentEnv;
