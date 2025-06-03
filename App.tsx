// This application is a standalone frontend application
// and does not require or use any external API keys,
// including a Gemini API key, for its core functionality.

import React, { useState, useEffect, useCallback } from 'react';
import { NumberButton } from './components/NumberButton';
import { FeedbackIcon } from './components/FeedbackIcon';

const MIN_TARGET_NUMBER = 3;
const MAX_TARGET_NUMBER = 10;
const AVAILABLE_NUMBERS = Array.from({ length: MAX_TARGET_NUMBER + 1 }, (_, i) => i); // 0 to 10

const App: React.FC = () => {
  const [targetNumber, setTargetNumber] = useState<number>(0);
  const [givenOperand, setGivenOperand] = useState<number | null>(null); // Initially given number
  const [selectedOperand, setSelectedOperand] = useState<number | null>(null); // Number selected by user
  const [feedback, setFeedback] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showNextButton, setShowNextButton] = useState<boolean>(false);

  const generateNewProblem = useCallback(() => {
    const newTarget = Math.floor(Math.random() * (MAX_TARGET_NUMBER - MIN_TARGET_NUMBER + 1)) + MIN_TARGET_NUMBER;
    // Ensure givenOperand is less than or equal to newTarget to allow for a non-negative selectedOperand
    const newGivenOperand = Math.floor(Math.random() * (newTarget + 1)); 
    
    setTargetNumber(newTarget);
    setGivenOperand(newGivenOperand);
    setSelectedOperand(null);
    setFeedback('');
    setIsCorrect(null);
    setShowNextButton(false);
  }, []);

  useEffect(() => {
    generateNewProblem();
  }, [generateNewProblem]);

  const handleNumberClick = (num: number) => {
    if (showNextButton) return; 

    setSelectedOperand(num);
    setFeedback(''); 
    setIsCorrect(null);
  };

  const handleClear = () => {
    setSelectedOperand(null);
    setFeedback('');
    setIsCorrect(null);
    setShowNextButton(false);
  };

  const handleCheckAnswer = () => {
    if (selectedOperand === null || givenOperand === null) {
      setFeedback('のこりの かずを えらんでね！');
      setIsCorrect(false);
      return;
    }

    if (givenOperand + selectedOperand === targetNumber) {
      setFeedback('せいかい！すごいね！🎉');
      setIsCorrect(true);
      setShowNextButton(true);
    } else {
      setFeedback('ちがうみたい… もういちどやってみよう！🤔');
      setIsCorrect(false);
      setShowNextButton(false);
    }
  };
  
  const OperandBox: React.FC<{ value: number | null, isGiven?: boolean, isActive?: boolean }> = 
    ({ value, isGiven = false, isActive = false }) => (
    <div
      className={`w-24 h-24 md:w-28 md:h-28 text-5xl font-bold flex items-center justify-center rounded-xl shadow-md transition-all duration-150
        ${isGiven ? 'bg-sky-200 text-sky-800 cursor-default' : 'bg-sky-200 text-sky-800'}
        ${isActive && !isGiven && !showNextButton ? 'ring-4 ring-pink-500 shadow-lg' : ''}
        ${showNextButton && isCorrect && value !== null ? 'animate-pulse border-4 border-green-400' : ''}
      `}
    >
      {value !== null ? value : '?'}
    </div>
  );


  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-sky-200 via-indigo-200 to-pink-200">
      <div className="bg-white shadow-xl rounded-2xl p-6 md:p-10 w-full max-w-2xl text-center">
        <h1 className="text-4xl md:text-5xl font-mochiy text-sky-700 mb-6">
          いくつと いくつ
        </h1>
        
        {!showNextButton && (
          <p className="text-xl md:text-2xl text-slate-700 mb-2">
            「<span className="font-bold text-pink-600 text-3xl md:text-4xl">{targetNumber}</span>」は
            「<span className="font-bold text-sky-600 text-3xl md:text-4xl">{givenOperand}</span>」と
            なに で できるかな？
          </p>
        )}
        {showNextButton && isCorrect && givenOperand !== null && selectedOperand !== null && (
           <p className="text-xl md:text-2xl text-green-600 mb-2 font-semibold">
            「<span className="font-bold text-pink-600 text-3xl md:text-4xl">{targetNumber}</span>」は
            「<span className="font-bold text-green-500 text-3xl md:text-4xl">{givenOperand}</span>」と
            「<span className="font-bold text-green-500 text-3xl md:text-4xl">{selectedOperand}</span>」で <br/>できたね！すごい！
          </p>
        )}


        <div className="flex items-center justify-center space-x-3 md:space-x-4 my-8">
          <OperandBox value={givenOperand} isGiven={true} />
          <span className="text-4xl md:text-5xl font-bold text-slate-600 mx-2">+</span>
          <OperandBox value={selectedOperand} isActive={true} />
          <span className="text-4xl md:text-5xl font-bold text-slate-600 mx-2">=</span>
          <div className="w-24 h-24 md:w-28 md:h-28 bg-pink-200 text-pink-800 text-5xl font-bold flex items-center justify-center rounded-xl shadow-md">
            {targetNumber}
          </div>
        </div>

        {feedback && (
          <div className={`flex items-center justify-center text-xl md:text-2xl font-semibold my-4 p-3 rounded-lg ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            <FeedbackIcon isCorrect={isCorrect} />
            <span className="ml-2">{feedback}</span>
          </div>
        )}

        {!showNextButton && (
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 md:gap-3 my-6 max-w-md mx-auto">
            {AVAILABLE_NUMBERS.map((num) => (
              <NumberButton
                key={num}
                number={num}
                onClick={() => handleNumberClick(num)}
                disabled={showNextButton || selectedOperand === num}
                selected={selectedOperand === num}
              />
            ))}
          </div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          {!showNextButton ? (
            <>
              <button
                onClick={handleClear}
                className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg text-xl transition-transform duration-150 hover:scale-105 shadow-md"
              >
                けす
              </button>
              <button
                onClick={handleCheckAnswer}
                disabled={selectedOperand === null}
                className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-xl transition-transform duration-150 hover:scale-105 shadow-md disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                かくにん
              </button>
            </>
          ) : (
            <button
              onClick={generateNewProblem}
              className="w-full sm:w-auto bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 px-8 rounded-lg text-2xl transition-transform duration-150 hover:scale-105 shadow-lg animate-bounce"
            >
              つぎのもんだいへ！
            </button>
          )}
        </div>
         <p className="text-sm text-slate-500 mt-8">
          ヒント: 「?」の はこに あてはまる かずを したから えらんでね！
        </p>
      </div>
      <footer className="text-center text-slate-600 py-4 mt-6">
        <p>&copy; {new Date().getFullYear()} たのしいさんすう</p>
      </footer>
    </div>
  );
};

export default App;