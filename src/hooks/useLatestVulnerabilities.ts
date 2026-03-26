"use client";

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

export interface CVEData {
    id: string;
    severity: string;
    score: number;
    description: string;
    date: string;
    status: string;
    component: string;
}

export function useLatestVulnerabilities() {
    const [data, setData] = useState<CVEData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuth();
    const isFirstFetch = useRef(true);

    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }

        let isMounted = true;

        const fetchData = async () => {
            if (isFirstFetch.current) {
                setLoading(true);
            }
            try {
                const response = await axios.get('/api/latest-vulnerabilities', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (isMounted) {
                    setData(response.data);
                    setError(null);
                    setLoading(false);
                    isFirstFetch.current = false;
                }
            } catch (err: any) {
                if (isMounted) {
                    console.error('Error fetching latest vulnerabilities:', err);
                    setError('Unable to fetch latest vulnerabilities');
                    setLoading(false);
                    // intentionally not clearing data to keep last cached data visible
                }
            }
        };

        fetchData();
        const intervalId = setInterval(fetchData, 45000); // 45s interval

        return () => {
            isMounted = false;
            clearInterval(intervalId);
        };
    }, [token]);

    return { data, loading, error };
}
