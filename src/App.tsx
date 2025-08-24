import React from 'react';
import { LiveAPIProvider } from './contexts/LiveAPIContext.tsx';
import VoiceInterface from './pages/VoiceInterface.tsx';
import './App.css';

const API_KEY = "AIzaSyAC1P_bHOqKVRxK2EWnTK8aIjpyjmm8U4Y";

const host = "generativelanguage.googleapis.com";
const uri = `wss://${host}/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent`;

function App() {
  return (
    <LiveAPIProvider url={uri} apiKey={API_KEY}>
      <div className="App">
        <VoiceInterface />
      </div>
    </LiveAPIProvider>
  );
}

export default App;
