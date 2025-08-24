export class AudioStreamer {
    private audioContext: AudioContext;
    private gainNode: GainNode;
    private workletNode: AudioWorkletNode | null = null;
    private isPlaying: boolean = false;

    constructor(audioContext: AudioContext) {
        this.audioContext = audioContext;
        this.gainNode = audioContext.createGain();
        this.gainNode.connect(audioContext.destination);
    }

    async addWorklet<T>(
        name: string,
        workletClass: any,
        onMessage: (event: MessageEvent<T>) => void
    ): Promise<void> {
        try {
            // Create a simple volume meter worklet inline
            const workletCode = `
                class VolMeterProcessor extends AudioWorkletProcessor {
                    constructor() {
                        super();
                        this.volume = 0;
                        this.updateIntervalInFrames = 512;
                        this.nextUpdateFrame = this.updateIntervalInFrames;
                    }

                    process(inputs, outputs, parameters) {
                        const input = inputs[0];
                        const output = outputs[0];

                        if (input.length > 0) {
                            const inputChannel = input[0];
                            const outputChannel = output[0];

                            // Copy input to output
                            for (let i = 0; i < inputChannel.length; i++) {
                                outputChannel[i] = inputChannel[i];
                            }

                            // Calculate volume
                            let sum = 0;
                            for (let i = 0; i < inputChannel.length; i++) {
                                sum += inputChannel[i] * inputChannel[i];
                            }
                            const rms = Math.sqrt(sum / inputChannel.length);
                            this.volume = Math.max(this.volume * 0.95, rms);

                            // Send volume updates
                            this.nextUpdateFrame -= inputChannel.length;
                            if (this.nextUpdateFrame < 0) {
                                this.nextUpdateFrame += this.updateIntervalInFrames;
                                this.port.postMessage({ volume: this.volume });
                            }
                        }

                        return true;
                    }
                }

                registerProcessor('vumeter-out', VolMeterProcessor);
            `;

            const blob = new Blob([workletCode], { type: 'application/javascript' });
            const workletUrl = URL.createObjectURL(blob);

            await this.audioContext.audioWorklet.addModule(workletUrl);
            
            this.workletNode = new AudioWorkletNode(this.audioContext, 'vumeter-out');
            this.workletNode.port.onmessage = onMessage;
            this.workletNode.connect(this.gainNode);

            URL.revokeObjectURL(workletUrl);
        } catch (error) {
            console.warn('Failed to add audio worklet:', error);
        }
    }

    addPCM16(data: Uint8Array): void {
        if (!this.audioContext || this.audioContext.state !== 'running') {
            return;
        }

        try {
            // Convert PCM16 to Float32Array
            const samples = new Float32Array(data.length / 2);
            const dataView = new DataView(data.buffer);
            
            for (let i = 0; i < samples.length; i++) {
                const sample = dataView.getInt16(i * 2, true); // little endian
                samples[i] = sample / 32768.0; // Convert to -1.0 to 1.0 range
            }

            // Create audio buffer
            const audioBuffer = this.audioContext.createBuffer(1, samples.length, 16000);
            audioBuffer.copyToChannel(samples, 0);

            // Create and play buffer source
            const source = this.audioContext.createBufferSource();
            source.buffer = audioBuffer;
            
            if (this.workletNode) {
                source.connect(this.workletNode);
            } else {
                source.connect(this.gainNode);
            }
            
            source.start();
            this.isPlaying = true;

            source.onended = () => {
                this.isPlaying = false;
            };
        } catch (error) {
            console.error('Error playing audio:', error);
        }
    }

    stop(): void {
        this.isPlaying = false;
    }

    setVolume(volume: number): void {
        this.gainNode.gain.value = Math.max(0, Math.min(1, volume));
    }
}
