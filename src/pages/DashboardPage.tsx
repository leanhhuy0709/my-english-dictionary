import React, { useEffect, useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import './dashboard-page.css'
// import axios from 'axios';

interface Word {
  // Define the structure of your dictionary here
  word: string;
  ipa: string
}

function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const DashboardPage: React.FC = () => {
  const [data, setData] = useState<Word[]>([]);
  const [rand, setRand] = useState<number>(0);
  const [name, setName] = useState<string>('Default')
  const [voiceIdx, setVoiceIdx] = useState<number>(0)

  useEffect(() => {
    import('../data/dictionary-consonants.json').then((json) => {
      // let shuffleData = shuffleArray(json.default)
      // setData(shuffleData)
      setData(json.default)
      // console.log(data)

      const vIdx = localStorage.getItem('voiceIdx')
      if (vIdx != '0' && !vIdx)
      {
        localStorage.setItem('voiceIdx', '0')
      }

    });
  }, [data]);

  const utterance = new SpeechSynthesisUtterance('');
  const voices = window.speechSynthesis.getVoices().filter((v) => v.lang === 'en-US');
  utterance.voice = voices[0];
  setName(voices[0].name);
  console.log(voices)


  const handleNext = () => {
    if (data.length > 0) {
      const nextWord = data[(rand + 1) % data.length].word
      setRand((rand + 1) % data.length)
      if (voices[voiceIdx].name !== utterance.voice?.name)
      {
        utterance.voice = voices[voiceIdx];
      }

      speak(nextWord);
    }
  }

  const handleBack = () => {
    if (data.length > 0) {
      const nextWord = data[(rand - 1 + data.length) % data.length].word
      setRand((rand - 1 + data.length) % data.length)
      if (voices[voiceIdx].name !== utterance.voice?.name)
      {
        utterance.voice = voices[voiceIdx];
      }
      speak(nextWord);
    }
  }

  const handleAgain = () => {
    if (data.length > 0) {
      const nextWord = data[(rand) % data.length].word
      if (voices[voiceIdx].name !== utterance.voice?.name)
      {
        utterance.voice = voices[voiceIdx];
      }
      speak(nextWord);
    }
  }

  
  const speak = async (text: string) => {
    speechSynthesis.cancel()
    utterance.text = text
    
    speechSynthesis.speak(utterance);
  };

  const prevVoice = async () => {
    let v = voiceIdx - 1;
    if (v > 0)
    {
      utterance.voice = voices[v];
    }
    else {
      v = voices.length - 1;
    }
    setName(voices[v].name);
    setVoiceIdx(v);

    speak("Hello")
    localStorage.setItem('voiceIdx', v.toString())
  }

  const nextVoice = async () => {
    let v = voiceIdx + 1;
    if (v < voices.length)
    {
      utterance.voice = voices[v];
    }
    else {
      v = 0;
    }
    setName(voices[v].name);
    setVoiceIdx(v);

    speak("Hello")

    localStorage.setItem('voiceIdx', v.toString())
  }



  const shuffle = () => {
    let shuffleData = shuffleArray(data)
    setData(shuffleData)
  }



  if (data.length > 0)
  return (
    <div className='out-side-block' style={{marginBottom: '0px'}}>
      <Container className='button-container' style={{marginTop: '10px', padding: '0px',justifyContent: 'center', alignItems: 'center', display:'flex'}}>
          <Button className='voice-button' onClick={prevVoice}>Prev Voice</Button>
          <Button className='voice-button' onClick={nextVoice}>Next Voice</Button>
          <Button className='voice-button' onClick={shuffle}>Shuffle</Button>
      </Container>
      <Container className='voice-name-container' style={{padding: '0px',justifyContent: 'center', alignItems: 'center', display:'flex'}}>
          {name}
      </Container>
      <Container className="board text-board">
        <Container className='text-board-1' style={{color: '#AF47D2'}}>
          {data[rand].word}
        </Container>
        <Container className='text-board-2'>
          {data[rand].ipa}
        </Container>
      </Container>
      <Container className='button-container' style={{marginTop: '20px', marginBottom: '0px', padding: '0px'}}>
          <Button className='button-back' onClick={handleBack}>Back</Button>
          <Button className='button-again' onClick={handleAgain}>Again</Button>
          <Button className='button-next' onClick={handleNext}>Next</Button>
      </Container>
    </div>
  );
  return <>Loading...</>
}

export default DashboardPage;