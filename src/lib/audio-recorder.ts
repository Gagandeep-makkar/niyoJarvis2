import { EventEmitter } from 'eventemitter3';

export class AudioRecorder extends EventEmitter {
    private mediaStream: MediaStream | null = null;
    private mediaRecorder: MediaRecorder | null = null;
    private audioContext: AudioContext | null = null;
    private analyser: AnalyserNode | null = null;
    private isRecording: boolean = false;
    private volumeCheckInterval: number | null = null;

    constructor() {
        super();
    }

    async start(): Promise<void> {
        try {
            // Request microphone access
            this.mediaStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    sampleRate: 16000,
                    channelCount: 1,
                    echoCancellation: true,
                    noiseSuppression: true,
                }
            });

            // Set up audio context for volume monitoring
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const source = this.audioContext.createMediaStreamSource(this.mediaStream);
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;
            source.connect(this.analyser);

            // Set up MediaRecorder for audio data
            this.mediaRecorder = new MediaRecorder(this.mediaStream, {
                mimeType: 'audio/webm;codecs=opus'
            });

            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.processAudioData(event.data);
                }
            };

            // Start recording
            this.mediaRecorder.start(100); // Get data every 100ms
            this.isRecording = true;

            // Start volume monitoring
            this.startVolumeMonitoring();

            console.log('Audio recording started');
        } catch (error) {
            console.error('Failed to start audio recording:', error);
            throw error;
        }
    }

    stop(): void {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            this.isRecording = false;
        }

        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach(track => track.stop());
            this.mediaStream = null;
        }

        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }

        if (this.volumeCheckInterval) {
            clearInterval(this.volumeCheckInterval);
            this.volumeCheckInterval = null;
        }

        console.log('Audio recording stopped');
    }

    private async processAudioData(blob: Blob): Promise<void> {
        try {
            // Convert blob to ArrayBuffer
            const arrayBuffer = await blob.arrayBuffer();
            
            // For simplicity, we'll convert to base64
            // In a real implementation, you might want to convert to PCM16
            const base64 = this.arrayBufferToBase64(arrayBuffer);
            
            this.emit('data', base64);
        } catch (error) {
            console.error('Error processing audio data:', error);
        }
    }

    private arrayBufferToBase64(buffer: ArrayBuffer): string {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    private startVolumeMonitoring(): void {
        if (!this.analyser) return;

        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        this.volumeCheckInterval = window.setInterval(() => {
            if (!this.analyser) return;

            this.analyser.getByteFrequencyData(dataArray);
            
            // Calculate average volume
            let sum = 0;
            for (let i = 0; i < bufferLength; i++) {
                sum += dataArray[i];
            }
            const average = sum / bufferLength;
            const volume = average / 255; // Normalize to 0-1

            this.emit('volume', volume);
        }, 50); // Update volume every 50ms
    }
}
