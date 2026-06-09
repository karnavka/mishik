import { useState, useEffect } from 'react';

interface FetchState<T> {
    data: T[];
    loading: boolean;
    error: string | null;
}

export function useFetch<T>(url: string | null, mockData?: T[]): FetchState<T> {
    const [state, setState] = useState<FetchState<T>>({
        data: mockData ?? [],
        loading: url !== null,
        error: null,
    });

    useEffect(() => {
        if (!url) return;  // no URL → keep using mock, do nothing

        setState(s => ({ ...s, loading: true, error: null }));

        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error(`Server error: ${res.status}`);
                return res.json();
            })
            .then((data: T[]) => setState({ data, loading: false, error: null }))
            .catch(err  => setState(s => ({ ...s, loading: false, error: err.message })));
    }, [url]);

    return state;
}