'use client';

import { useState, useCallback, useRef } from 'react';

export interface AIClassificationResult {
    type: string;
    platform: string;
    risk: string;
    confidence: number;
    symptoms: string[];
    urgency: string;
}

export interface AIMessage {
    id: number;
    role: 'user' | 'assistant';
    text?: string;
    classification?: AIClassificationResult;
    isDomainBlocked?: boolean;
    isError?: boolean;
}

export interface AIHistoryRecord {
    _id: string;
    input: string;
    threat_type: string;
    severity: string;
    isDomainBlocked: boolean;
    createdAt: string;
}

function getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
}

function generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function useAIAssistant() {
    const [messages, setMessages] = useState<AIMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [history, setHistory] = useState<AIHistoryRecord[]>([]);
    const [isHistoryLoading, setIsHistoryLoading] = useState(false);

    // Stable session id for this conversation; reset on clearMessages
    const sessionIdRef = useRef<string>(generateSessionId());

    // Track plain-text turns for context
    const contextHistoryRef = useRef<{ role: string; text: string }[]>([]);

    const sendMessage = useCallback(async (input: string) => {
        if (!input.trim() || isLoading) return;

        const userMsg: AIMessage = {
            id: Date.now(),
            role: 'user',
            text: input.trim()
        };

        setMessages(prev => [...prev, userMsg]);
        setIsLoading(true);

        // Add user turn to context history
        contextHistoryRef.current = [
            ...contextHistoryRef.current,
            { role: 'user', text: input.trim() }
        ];

        try {
            const token = getToken();
            const resp = await fetch('/api/ai/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    message: input.trim(),
                    sessionId: sessionIdRef.current,
                    history: contextHistoryRef.current.slice(0, -1)
                })
            });

            const data = await resp.json();

            if (!resp.ok) {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    role: 'assistant',
                    text: data.message || 'An error occurred. Please try again.',
                    isError: true
                }]);
                return;
            }

            if (data.domain_blocked) {
                const blockedText = data.message || 'I can only assist with cybersecurity-related queries.';
                contextHistoryRef.current = [
                    ...contextHistoryRef.current,
                    { role: 'assistant', text: blockedText }
                ];
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    role: 'assistant',
                    isDomainBlocked: true,
                    text: blockedText
                }]);
            } else {
                contextHistoryRef.current = [
                    ...contextHistoryRef.current,
                    { role: 'assistant', text: data.message }
                ];

                try {
                    const localHistory = JSON.parse(localStorage.getItem('cyberAssistantHistory') || '[]');
                    const newRecord = {
                        _id: Date.now().toString(),
                        input: input.trim(),
                        threat_type: data.classification?.type || 'GENERAL',
                        severity: data.classification?.risk || 'UNKNOWN',
                        isDomainBlocked: false,
                        createdAt: new Date().toISOString()
                    };
                    localStorage.setItem('cyberAssistantHistory', JSON.stringify([newRecord, ...localHistory]));
                } catch(e) { console.error('History save error', e); }

                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    role: 'assistant',
                    classification: data.classification,
                    text: data.message
                }]);
            }
        } catch {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'assistant',
                text: 'Failed to connect to the AI server. Please check your connection.',
                isError: true
            }]);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading]);

    const clearMessages = useCallback(() => {
        setMessages([]);
        contextHistoryRef.current = [];
        sessionIdRef.current = generateSessionId(); // New session
    }, []);

    const fetchHistory = useCallback(async () => {
        setIsHistoryLoading(true);
        try {
            const localHistory = JSON.parse(localStorage.getItem('cyberAssistantHistory') || '[]');
            setHistory(localHistory);
        } catch {
            setHistory([]);
        } finally {
            setIsHistoryLoading(false);
        }
    }, []);

    return { messages, isLoading, sendMessage, clearMessages, history, isHistoryLoading, fetchHistory };
}
