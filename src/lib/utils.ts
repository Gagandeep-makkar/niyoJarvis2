export async function blobToJSON(blob: Blob): Promise<any> {
    const text = await blob.text();
    return JSON.parse(text);
}

export function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

export async function audioContext(options: { id: string }): Promise<AudioContext> {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Resume audio context if it's suspended (required by some browsers)
    if (audioContext.state === 'suspended') {
        await audioContext.resume();
    }
    
    return audioContext;
}
