import { useCallback, useEffect, useRef, useState } from 'react';

function getSpeechRecognition() {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

export function useSpeechRecognition({ onTranscript, onError }) {
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [isSupported] = useState(() => Boolean(getSpeechRecognition()));

  useEffect(() => {
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) return undefined;

    const recognition = new SpeechRecognition();
    recognition.lang = 'ru-RU';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      let interim = '';
      let final = '';

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const chunk = event.results[index][0]?.transcript ?? '';
        if (event.results[index].isFinal) final += chunk;
        else interim += chunk;
      }

      onTranscript?.({ final, interim });
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      onError?.(event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    return () => {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition.abort();
      recognitionRef.current = null;
    };
  }, [onError, onTranscript]);

  const start = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition || isListening) return;

    try {
      recognition.start();
      setIsListening(true);
    } catch {
      setIsListening(false);
    }
  }, [isListening]);

  const stop = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    recognition.stop();
    setIsListening(false);
  }, []);

  const toggle = useCallback(() => {
    if (isListening) stop();
    else start();
  }, [isListening, start, stop]);

  return { isSupported, isListening, start, stop, toggle };
}
