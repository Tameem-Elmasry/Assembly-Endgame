// @ imports
import Header from "./components/Header.jsx";
import { languages } from "./assets/languages.js";
import React from "react";
import clsx from "clsx";
import { getRandomWord, getFarewellText } from "./assets/utils.js";
import Confetti from "react-confetti";

export default function AssemblyEndgame() {
    // * State values :
    const [currentWord, setCurrentWord] = React.useState(() => getRandomWord());
    const [guessedLetters, setGuessedLetters] = React.useState([]);
    React.useEffect(() => {
        console.log(currentWord);
    }, [currentWord]);

    // * Derived values :
    let wrongGuessCount = guessedLetters.filter(
        (letter) =>
            currentWord
                .split("")
                .map((ele) => ele.toUpperCase())
                .includes(letter) === false
    ).length;

    const isGameWon = currentWord
        .split("")
        .every((letter) => guessedLetters.includes(letter.toUpperCase()));
    const isGameLost = wrongGuessCount >= languages.length - 1;
    const isGameOver = isGameWon || isGameLost;

    // * static values :
    const wordElements = currentWord.split("").map((letter, index) => {
        return (
            <span
                className={
                    isGameOver && !guessedLetters.includes(letter.toUpperCase())
                        ? "wrong"
                        : null
                }
                key={index}
            >
                {guessedLetters.includes(letter.toUpperCase()) || isGameOver
                    ? letter.toUpperCase()
                    : ""}
            </span>
        );
    });
    const lastGuessedLetter = guessedLetters[guessedLetters.length - 1];
    const isLastGuessWrong =
        lastGuessedLetter &&
        !currentWord
            .split("")
            .map((lett) => lett.toUpperCase())
            .includes(lastGuessedLetter);

    const languageElements = languages.map((lang, index) => {
        let isKilled = index < wrongGuessCount;
        let styles = {
            color: lang.color,
            backgroundColor: lang.backgroundColor,
        };
        let className = clsx("lang", isKilled && "killed");
        return (
            <span className={className} style={styles} key={lang.name}>
                {lang.name}
            </span>
        );
    });

    const alphabetElements = "abcdefghijklmnopqrstuvwxyz"
        .split("")
        .map((letter) => {
            const isGuessed = guessedLetters.includes(letter.toUpperCase());
            let isCorrect =
                currentWord
                    .split("")
                    .map((wordL) => wordL.toUpperCase())
                    .includes(letter.toUpperCase()) && isGuessed;
            let isWrong =
                currentWord
                    .split("")
                    .map((wordL) => wordL.toUpperCase())
                    .includes(letter.toUpperCase()) === false && isGuessed;
            let className = clsx("alphabet-letter", {
                right: isCorrect,
                wrong: isWrong,
            });
            return (
                <button
                    onClick={() => letterClicked(letter.toUpperCase())}
                    className={className}
                    key={letter.toUpperCase()}
                    aria-disabled={guessedLetters.includes(
                        letter.toUpperCase()
                    )}
                    aria-label={`Letter ${letter.toUpperCase()}`}
                    disabled={isGameOver}
                >
                    {letter.toUpperCase()}
                </button>
            );
        });

    // * Functions :
    function letterClicked(letter) {
        setGuessedLetters((prev) =>
            prev.includes(letter) ? [...prev] : [...prev, letter]
        );
    }

    function newGame() {
        console.clear();
        setCurrentWord(getRandomWord());
        setGuessedLetters([]);
    }

    function renderGameStatus() {
        if (!isGameOver && isLastGuessWrong) {
            return (
                <p>{getFarewellText(languages[wrongGuessCount - 1].name)}</p>
            );
        }
        if (isGameWon) {
            return (
                <>
                    <h2>you win!</h2>
                    <p>
                        Well done 🎉{" "}
                        {wrongGuessCount === 0
                            ? `No Mistakes!!`
                            : wrongGuessCount === 1
                            ? `you got ${wrongGuessCount} Mistake only`
                            : `you got ${wrongGuessCount} Mistakes only`}
                    </p>
                </>
            );
        }
        if (isGameLost) {
            return (
                <>
                    <h2>Game over!</h2>
                    <p>You lose! Better start learning Assembly 😭</p>
                </>
            );
        }
        return null;
    }

    return (
        <>
            {isGameWon && <Confetti recycle={false} numberOfPieces={1000} />}
            <Header />

            <div
                aria-live="polite"
                role="status"
                className={clsx("game-status", {
                    won: isGameWon,
                    lost: isGameLost,
                    farewell: isLastGuessWrong && !isGameOver,
                })}
            >
                {renderGameStatus()}
            </div>

            <div className="languages-container">{languageElements}</div>

            <div className="guess-word">{wordElements}</div>

            {/* Combined visually-hidden aria-live region for status updates */}
            <div aria-live="polite" role="status" className="word-sr-only">
                <p>
                    {currentWord
                        .split("")
                        .map((letter) => letter.toUpperCase())
                        .includes(lastGuessedLetter)
                        ? `You guessed Right!!, The letter ${lastGuessedLetter} is in the word`
                        : `sorry, the letter ${lastGuessedLetter} is not in the word`}
                    You have {languages.length - 1 - wrongGuessCount} attempts
                    left
                </p>
                <p>
                    current word:{" "}
                    {currentWord
                        .split("")
                        .map((letter) =>
                            guessedLetters.includes(letter.toUpperCase())
                                ? letter + "."
                                : "Blank."
                        )}
                </p>
            </div>

            <div className="keyboard">{alphabetElements}</div>

            <button
                onClick={newGame}
                className={clsx("new-game", { show: isGameOver })}
            >
                New Game
            </button>
        </>
    );
}
