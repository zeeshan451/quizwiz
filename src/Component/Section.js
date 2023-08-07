import React, { useState, useEffect } from 'react';
import './Section.css';
import Spinner from './Spinner';

export default function Section() {
  const [quizData, setQuizData] = useState({});
  const [difficulty, setDifficulty] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    fetchData();
  }, [difficulty, category, amount]);

  const fetchData = async () => {
    if (!difficulty || !category || !amount) return;

    const apiurl = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`;
    const response = await fetch(apiurl);
    const data = await response.json();

    // Shuffle the answer options for each question
    const shuffledData = {
      ...data,
      results: data.results.map((question) => ({
        ...question,
        options: shuffleArray([
          question.correct_answer,
          ...question.incorrect_answers,
        ]),
      })),
    };
    setQuizData(shuffledData);
  };

  const handleOptionChange = (event) => {
    setSelectedAnswer(event.target.value);
  };

  const handleSubmit = () => {
    if (!quizCompleted) {
      const isAnswerCorrect =
        selectedAnswer === quizData.results[currentQuestion].correct_answer;
      setScore((prevScore) => (isAnswerCorrect ? prevScore + 1 : prevScore));
      setIsAnswerCorrect(isAnswerCorrect);
      setQuizCompleted(true);
    } else {
      if (currentQuestion + 1 < quizData.results.length) {
        setCurrentQuestion((prevQuestion) => prevQuestion + 1);
        setSelectedAnswer('');
        setIsAnswerCorrect(null);
        setQuizCompleted(false);
      } else {
        setQuizCompleted(false);
        alert(`You scored ${score}/${quizData.results.length}`);
      }
    }
  };

  const handleRestartQuiz = () => {
    setQuizData({});
    setDifficulty('');
    setCategory('');
    setAmount('');
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setScore(0);
    setIsAnswerCorrect(null);
    setQuizCompleted(false);
  };

  // Helper function to shuffle an array
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Render the answer options
  const renderAnswerOptions = () => {
    const question = quizData.results[currentQuestion];
    return question.options.map((option, index) => (
      <h5 key={`option${index}`}>
        <input
          type="radio"
          id={`option${index}`}
          name="options"
          value={option}
          checked={selectedAnswer === option}
          onChange={handleOptionChange}
        />{' '}
        {option}
      </h5>
    ));
  };

  return (
    <div>
      <div id="main" className="container-sm shadow p-3 mb-5 bg-body-tertiary rounded">
        <div className="container">
          <h4>Difficulty</h4>
          <label htmlFor="easy">
            <h5>Easy</h5>
          </label>
          <input
            type="radio"
            id="easy"
            name="difficulty"
            checked={difficulty === 'easy'}
            onChange={() => setDifficulty('easy')}
          />
          <label htmlFor="medium">
            <h5>Medium</h5>
          </label>
          <input
            type="radio"
            id="medium"
            name="difficulty"
            checked={difficulty === 'medium'}
            onChange={() => setDifficulty('medium')}
          />
          <label htmlFor="hard">
            <h5>Hard</h5>
          </label>
          <input
            type="radio"
            id="hard"
            name="difficulty"
            checked={difficulty === 'hard'}
            onChange={() => setDifficulty('hard')}
          />
        </div>

        <div className="container my-2">
          <h4>Category</h4>
          <label htmlFor="sports">
            <h5>Sports</h5>
          </label>
          <input
            type="radio"
            id="sports"
            name="category"
            checked={category === '21'}
            onChange={() => setCategory('21')}
          />

          <label htmlFor="politics">
            <h5>Politics</h5>
          </label>
          <input
            type="radio"
            id="politics"
            name="category"
            checked={category === '24'}
            onChange={() => setCategory('24')}
          />

          <label htmlFor="geography">
            <h5>Geography</h5>
          </label>
          <input
            type="radio"
            id="geography"
            name="category"
            checked={category === '22'}
            onChange={() => setCategory('22')}
          />

          <label htmlFor="history">
            <h5>History</h5>
          </label>
          <input
            type="radio"
            id="history"
            name="category"
            checked={category === '23'}
            onChange={() => setCategory('23')}
          />
        </div>

        <div className="container my-2">
          <h4>Number of Questions</h4>
          <label htmlFor="ten">
            <h5>10</h5>
          </label>
          <input
            type="radio"
            id="ten"
            name="amount"
            checked={amount === '10'}
            onChange={() => setAmount('10')}
          />

          <label htmlFor="fifteen">
            <h5>15</h5>
          </label>
          <input
            type="radio"
            id="fifteen"
            name="amount"
            checked={amount === '15'}
            onChange={() => setAmount('15')}
          />

          <label htmlFor="twenty">
            <h5>20</h5>
          </label>
          <input
            type="radio"
            id="twenty"
            name="amount"
            checked={amount === '20'}
            onChange={() => setAmount('20')}
          />
        </div>

        {Object.keys(quizData).length === 0 ? (
          <div className="container my-3 d-flex justify-content-center">
            <Spinner />
          </div>
        ) : (
          <div>
            <div>
              <h4 className="container my-3">Q{currentQuestion + 1}: {quizData.results[currentQuestion].question}</h4>
              <div className="container my-2">
                {renderAnswerOptions()}
              </div>
              <div className="container my-3 d-flex align-items-center justify-content-center">
                {isAnswerCorrect !== null && (
                  <p className={isAnswerCorrect ? 'correct-text' : 'incorrect-text'}>
                    {isAnswerCorrect ? 'Correct!' : 'Incorrect!'}
                  </p>
                )}
              </div>

              <div id="result" className="container my-2">
                Your Result: {score}/{amount}
              </div>

              <div className="container my-3 d-flex align-items-center justify-content-center">
                <button
                  id="btn"
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={!selectedAnswer || (quizCompleted && currentQuestion === quizData.results.length - 1)}
                >
                  {quizCompleted ? 'Next' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        )}

        {quizCompleted && currentQuestion === quizData.results.length - 1 && (
          <div className="container my-3 d-flex align-items-center justify-content-center">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleRestartQuiz}
            >
              Play again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
