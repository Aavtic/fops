import { MeEndpoint } from '@/lib/http/endpoints'

import { useState, useEffect } from 'react'

export function useAuth() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();

        fetch(MeEndpoint, {
            credentials: "include",
            signal: controller.signal
        })
        .then(res => {
            if (res.ok) {
                setLoggedIn(true);
            } else {
                setLoggedIn(false);
            }
        })
        .catch((err) => {
            if (err.name !== 'AbortError') {
                setLoggedIn(false);
            }
        })
        .finally(() => {
            // Ensure this is the ONLY place loading is set to false
            setLoading(false);
        });

        return () => controller.abort();
    }, []);

    return { loggedIn, loading };
}
