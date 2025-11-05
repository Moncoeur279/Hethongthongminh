import React, { useState, useEffect } from "react";
import "../styles/FlashcardGame.css";

const FlashcardGame = ({ lookups }) => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matched, setMatched] = useState(new Set());

  useEffect(() => {
    const newCards = [];
    lookups.forEach((lookup) => {
      newCards.push({
        word: lookup.word,
        phonetic: lookup.phonetic,
        isFlipped: false,
        id: Math.random(),
      });
      newCards.push({
        word: lookup.phonetic,
        phonetic: lookup.word,
        isFlipped: false,
        id: Math.random(),
      });
    });
    setCards(newCards);
  }, [lookups]);

  const handleCardClick = (index) => {
    if (flippedCards.includes(index) || matched.has(index)) return;

    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      const [firstCardIndex, secondCardIndex] = newFlippedCards;
      const firstCard = cards[firstCardIndex];
      const secondCard = cards[secondCardIndex];

      if (
        firstCard.word === secondCard.phonetic ||
        firstCard.phonetic === secondCard.word
      ) {
        setMatched(
          (prev) => new Set(prev.add(firstCardIndex).add(secondCardIndex))
        );
      }

      setTimeout(() => setFlippedCards([]), 1000);
    }
  };

  const handleRestart = () => {
    setMatched(new Set());
    setFlippedCards([]);
    setCards((prevCards) => {
      const shuffledCards = [...prevCards];
      for (let i = shuffledCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledCards[i], shuffledCards[j]] = [
          shuffledCards[j],
          shuffledCards[i],
        ];
      }
      return shuffledCards;
    });
  };

  return (
    <div className="flashcard-game">
      <h3>Flashcard Game</h3>
      <div className="flashcards-container">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className={`flashcard ${flippedCards.includes(index) ? "flipped" : ""
              } ${matched.has(index) ? "matched" : ""}`}
            onClick={() => handleCardClick(index)}
          >
            <p>
              {flippedCards.includes(index) || matched.has(index)
                ? card.word
                : "?"}
            </p>
          </div>
        ))}
      </div>
      <button className="restart-button" onClick={handleRestart}>
        Restart Game
      </button>
    </div>
  );
};

export default FlashcardGame;
