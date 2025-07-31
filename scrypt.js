document.addEventListener("DOMContentLoaded", function () {
  // Game state
  const state = {
    currentScreen: "lobby",
    currentWord: "",
    guessedLetters: [],
    wrongGuesses: 0,
    maxWrongGuesses: 6,
    gameOver: false,
    winner: null,
  };

  // Words database
  const words = {
    crypto: ["bitcoin", "wallet", "solana", "ledger", "gas", "blockchain"],
    tech: ["router", "debug", "server", "network", "script", "cookie"],
  };

  // Hangman drawings for each wrong guess
  const hangmanDrawings = [
    `
          +---+
          |   |
              |
              |
              |
              |
        =========
        `,
    `
          +---+
          |   |
          O   |
              |
              |
              |
        =========
        `,
    `
          +---+
          |   |
          O   |
          |   |
              |
              |
        =========
        `,
    `
          +---+
          |   |
          O   |
         /|   |
              |
              |
        =========
        `,
    `
          +---+
          |   |
          O   |
         /|\\  |
              |
              |
        =========
        `,
    `
          +---+
          |   |
          O   |
         /|\\  |
         /    |
              |
        =========
        `,
    `
          +---+
          |   |
          O   |
         /|\\  |
         / \\  |
              |
        =========
        `,
  ];

  // DOM elements
  const lobbyScreen = document.getElementById("lobby");
  const gameScreen = document.getElementById("game");
  const roomsList = document.getElementById("roomsList");
  const hangmanDrawing = document.getElementById("hangmanDrawing");
  const wordDisplay = document.getElementById("wordDisplay");
  const keyboard = document.getElementById("keyboard");
  const gameStatus = document.getElementById("gameStatus");
  const categoryDisplay = document.getElementById("category");
  const playAgainBtn = document.getElementById("playAgain");

  // Initialize the game
  function init() {
    renderLobby();
    setupEventListeners();
  }

  // Render the lobby with rooms
  function renderLobby() {
    roomsList.innerHTML = "";

    // Create 12 rooms, with 2 available
    for (let i = 1; i <= 12; i++) {
      const room = document.createElement("div");
      room.className = "room";
      room.textContent = `Room ${i.toString().padStart(2, "0")}`;

      // Make rooms 3 and 7 available
      if (i === 3 || i === 7) {
        room.classList.add("available");
        room.addEventListener("click", () => startGame());
      } else {
        room.classList.add("unavailable");
        const statuses = ["In Game", "Locked", "Full"];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        room.textContent += ` (${status})`;
      }

      roomsList.appendChild(room);
    }
  }

  // Set up event listeners
  function setupEventListeners() {
    playAgainBtn.addEventListener("click", () => {
      resetGame();
      switchScreen("lobby");
    });
  }

  // Switch between screens
  function switchScreen(screen) {
    state.currentScreen = screen;
    lobbyScreen.classList.toggle("visible", screen === "lobby");
    gameScreen.classList.toggle("visible", screen === "game");
  }

  // Start a new game
  function startGame() {
    resetGame();
    switchScreen("game");

    // Choose a random category and word
    const categories = Object.keys(words);
    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)];
    const wordList = words[randomCategory];
    state.currentWord =
      wordList[Math.floor(Math.random() * wordList.length)].toUpperCase();

    // Set category display
    categoryDisplay.textContent = `CATEGORY: ${randomCategory.toUpperCase()}`;

    // Render initial game state
    renderWord();
    renderKeyboard();
    updateHangmanDrawing();
  }

  // Reset game state
  function resetGame() {
    state.currentWord = "";
    state.guessedLetters = [];
    state.wrongGuesses = 0;
    state.gameOver = false;
    state.winner = null;

    wordDisplay.innerHTML = "";
    gameStatus.textContent = "";
    hangmanDrawing.textContent = "";
  }

  // Render the word with blanks and guessed letters
  function renderWord() {
    let display = "";
    for (const letter of state.currentWord) {
      if (state.guessedLetters.includes(letter) || state.gameOver) {
        display += letter + " ";
      } else {
        display += "_ ";
      }
    }
    wordDisplay.textContent = display.trim();

    // Check if player has won
    if (!display.includes("_") && !state.gameOver) {
      endGame(true);
    }
  }

  // Render the keyboard
  function renderKeyboard() {
    keyboard.innerHTML = "";
    for (let i = 65; i <= 90; i++) {
      const letter = String.fromCharCode(i);
      const key = document.createElement("div");
      key.className = "key";
      key.textContent = letter;

      if (state.guessedLetters.includes(letter)) {
        key.classList.add("used");
      } else {
        key.addEventListener("click", () => handleGuess(letter));
      }

      keyboard.appendChild(key);
    }
  }

  // Handle a letter guess
  function handleGuess(letter) {
    if (state.gameOver || state.guessedLetters.includes(letter)) return;

    state.guessedLetters.push(letter);

    if (!state.currentWord.includes(letter)) {
      state.wrongGuesses++;
      updateHangmanDrawing();

      // Check if player has lost
      if (state.wrongGuesses >= state.maxWrongGuesses) {
        endGame(false);
      }
    }

    renderWord();
    renderKeyboard();
  }

  // Update the hangman drawing
  function updateHangmanDrawing() {
    hangmanDrawing.textContent = hangmanDrawings[state.wrongGuesses];
  }

  // End the game
  function endGame(playerWon) {
    state.gameOver = true;
    state.winner = playerWon ? "You" : "Computer";
    gameStatus.textContent = `WINNER: ${state.winner}`;
    renderWord(); // Reveal the word
  }

  // Initialize the game
  init();
});
