import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    MultimodalLiveAPIClientConnection,
    MultimodalLiveClient,
} from '../lib/multimodal-live-client.ts';
import { LiveConfig } from '../types/multimodal-live-types.ts';
import { AudioStreamer } from '../lib/AudioStreamer.ts';
import { createAudioContext } from '../lib/audio-utils.ts';

export type UseLiveAPIResults = {
    client: MultimodalLiveClient;
    setConfig: (config: LiveConfig) => void;
    updateConfig: (config: LiveConfig) => void;
    sendText: (message: string) => void;
    config: LiveConfig;
    connected: boolean;
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    volume: number;
    initializeAudioStreamer: () => Promise<void>;
};

const BASE_CONFIG: LiveConfig = {
    model: 'models/gemini-live-2.5-flash-preview',
    generationConfig: {
        responseModalities: 'audio',
        speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Aoede' } },
        },
    },
};

export function useLiveAPI({
    url,
    apiKey,
}: MultimodalLiveAPIClientConnection): UseLiveAPIResults {
    const client = useMemo(
        () => new MultimodalLiveClient({ url, apiKey }),
        [url, apiKey]
    );
    const audioStreamerRef = useRef<AudioStreamer | null>(null);

    const [connected, setConnected] = useState(false);
    const [config, setConfig] = useState<LiveConfig>(BASE_CONFIG);
    const [volume, setVolume] = useState(0);

    // Initialize audio streamer when needed (after user gesture)
    const initializeAudioStreamer = useCallback(async () => {
        if (!audioStreamerRef.current) {
            console.log('🎧 [useLiveAPI] Initializing AudioStreamer after user gesture...');
            try {
                // Create audio context with 24kHz sample rate to match AudioStreamer
                const audioCtx = await createAudioContext(24000);
                audioStreamerRef.current = new AudioStreamer(audioCtx);
                // Set up completion callback
                audioStreamerRef.current.onComplete = () => {
                    console.log('🔇 Audio playback completed');
                };
                console.log('✅ [useLiveAPI] AudioStreamer initialized successfully');
            } catch (error) {
                console.error('❌ [useLiveAPI] Failed to initialize AudioStreamer:', error);
            }
        }
    }, []);

    useEffect(() => {
        console.log('🎧 [useLiveAPI] Setting up client event handlers...');

        const onClose = () => {
            console.log('🔌 [useLiveAPI] Client connection closed');
            setConnected(false);
        };

        const stopAudioStreamer = () => {
            console.log('🔇 [useLiveAPI] Stopping audio streamer on interrupt');
            audioStreamerRef.current?.stop();
        };

        const onAudio = (data: ArrayBuffer) => {
            console.log('🔊 [useLiveAPI] Received audio data:', data.byteLength, 'bytes');
            if (audioStreamerRef.current) {
                console.log('🔊 [useLiveAPI] AudioStreamer available, processing audio...');
                // Resume audio context if needed
                audioStreamerRef.current.resume();
                // Add the audio data
                audioStreamerRef.current.addPCM16(new Uint8Array(data));
                console.log('🔊 [useLiveAPI] Audio data sent to AudioStreamer');
            } else {
                console.warn('⚠️ [useLiveAPI] AudioStreamer not available, audio data dropped');
            }
        };

        console.log('📡 [useLiveAPI] Registering client event listeners...');
        client
            .on('close', onClose)
            .on('interrupted', stopAudioStreamer)
            .on('audio', onAudio);

        return () => {
            console.log(
                '🧹 [useLiveAPI] Cleaning up client event listeners...'
            );
            client
                .off('close', onClose)
                .off('interrupted', stopAudioStreamer)
                .off('audio', onAudio);
        };
    }, [client]);

    const connect = useCallback(async () => {
        console.log('🔌 [useLiveAPI] Connect function called');
        console.log('📋 [useLiveAPI] Config:', config);
        console.log('🔌 [useLiveAPI] Current connected state:', connected);

        if (!config) {
            console.error('❌ [useLiveAPI] No config available!');
            throw new Error('config has not been set');
        }

        console.log('🔌 [useLiveAPI] Disconnecting existing connection...');
        client.disconnect();

        try {
            console.log('🚀 [useLiveAPI] Starting new connection...');
            await client.connect(config);
            console.log(
                '✅ [useLiveAPI] Connection established, setting connected=true'
            );
            setConnected(true);
            
            // Initialize AudioStreamer immediately after connection
            await initializeAudioStreamer();
        } catch (error) {
            console.error('❌ [useLiveAPI] Client connection failed:', error);
            console.error('🔍 [useLiveAPI] Error type:', typeof error);
            console.error(
                '🔍 [useLiveAPI] Error message:',
                error instanceof Error ? error.message : 'Unknown error'
            );
            setConnected(false);
            throw error;
        }
    }, [client, setConnected, config, connected, initializeAudioStreamer]);

    const disconnect = useCallback(async () => {
        console.log('🔌 [useLiveAPI] Disconnect function called');
        console.log('🔌 [useLiveAPI] Current connected state:', connected);
        client.disconnect();
        console.log('✅ [useLiveAPI] Disconnected, setting connected=false');
        setConnected(false);
    }, [setConnected, client, connected]);

    const updateConfig = useCallback((newConfig: LiveConfig) => {
        console.log('🔄 [useLiveAPI] Updating config on active connection...');
        
        const mergedConfig = {
            ...BASE_CONFIG,
            ...newConfig,
        };
        
        try {
            client.updateConfig(mergedConfig);
            setConfig(mergedConfig);
            console.log('✅ [useLiveAPI] Config updated successfully');
        } catch (error) {
            console.error('❌ [useLiveAPI] Failed to update config:', error);
            throw error;
        }
    }, [client, setConfig]);

    const sendText = useCallback((message: string) => {
        console.log('📤 [useLiveAPI] Sending text message:', message);
        try {
            client.send([{ text: message }]);
            console.log('✅ [useLiveAPI] Text message sent successfully');
        } catch (error) {
            console.error('❌ [useLiveAPI] Failed to send text message:', error);
            throw error;
        }
    }, [client]);

    return {
        client,
        config,
        setConfig,
        updateConfig,
        sendText,
        connected,
        connect,
        disconnect,
        volume,
        initializeAudioStreamer,
    };
}
