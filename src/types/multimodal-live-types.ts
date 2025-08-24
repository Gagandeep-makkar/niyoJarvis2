import { Content, GenerativeContentBlob, Part } from '@google/generative-ai';

export interface LiveConfig {
    model: string;
    generationConfig?: {
        responseModalities?: string;
        speechConfig?: {
            voiceConfig?: {
                prebuiltVoiceConfig?: {
                    voiceName: string;
                };
            };
        };
    };
    systemInstruction?: {
        parts: Array<{
            text: string;
        }>;
    };
    tools?: Array<{
        functionDeclarations: any;
    }>;
}

export interface StreamingLog {
    date: Date;
    type: string;
    message: any;
}

export interface SetupMessage {
    setup: LiveConfig;
}

export interface RealtimeInputMessage {
    realtimeInput: {
        mediaChunks: GenerativeContentBlob[];
    };
}

export interface ClientContentMessage {
    clientContent: {
        turns: Content[];
        turnComplete: boolean;
    };
}

export interface ToolResponseMessage {
    toolResponse: {
        functionResponses: Array<{
            response: any;
            id: string;
        }>;
    };
}

export interface ModelTurn {
    modelTurn: {
        parts: Part[];
    };
}

export interface ServerContent {
    modelTurn?: {
        parts: Part[];
    };
    interrupted?: boolean;
    turnComplete?: boolean;
}

export interface ToolCall {
    functionCalls?: Array<{
        name: string;
        id: string;
        args?: any;
    }>;
}

export interface ToolCallCancellation {
    ids: string[];
}

export type LiveIncomingMessage = 
    | { setupComplete: {} }
    | { serverContent: ServerContent }
    | { toolCall: ToolCall }
    | { toolCallCancellation: ToolCallCancellation };

// Type guards
export function isSetupCompleteMessage(msg: any): msg is { setupComplete: {} } {
    return msg && typeof msg.setupComplete !== 'undefined';
}

export function isServerContentMessage(msg: any): msg is { serverContent: ServerContent } {
    return msg && typeof msg.serverContent !== 'undefined';
}

export function isToolCallMessage(msg: any): msg is { toolCall: ToolCall } {
    return msg && typeof msg.toolCall !== 'undefined';
}

export function isToolCallCancellationMessage(msg: any): msg is { toolCallCancellation: ToolCallCancellation } {
    return msg && typeof msg.toolCallCancellation !== 'undefined';
}

export function isModelTurn(content: ServerContent): content is { modelTurn: { parts: Part[] } } {
    return content && typeof content.modelTurn !== 'undefined';
}

export function isInterrupted(content: ServerContent): boolean {
    return content && content.interrupted === true;
}

export function isTurnComplete(content: ServerContent): boolean {
    return content && content.turnComplete === true;
}
