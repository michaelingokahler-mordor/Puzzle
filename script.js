// Import Firebase configuration
import { db, isFirebaseEnabled, collection, addDoc, getDocs, query, orderBy, onSnapshot, limit } from './firebase-config.js';

// Puzzle Game State
const PUZZLE_VERSION = 'v0.96';

// Language Translations
const TRANSLATIONS = {
    de: {
        title: 'Puzzle Spiel',
        subtitle: 'Laden Sie ein Bild und setzen Sie das Puzzle zusammen!',
        imageUpload: 'Bild laden:',
        puzzleSize: 'Puzzle-Größe:',
        gameMode: 'Spielmodus:',
        modeJigsaw: 'Klassisches Puzzle',
        modeSliding: 'Schiebepuzzle',
        playerName: 'Spielername:',
        playerPlaceholder: 'Dein Name',
        pieces: 'Teile',
        startButton: 'Puzzle starten',
        shuffleButton: 'Neu mischen',
        previewButton: 'Vorschau anzeigen/ausblenden',
        resultsButton: '🏆 Ergebnisse',
        preview: 'Vorschau',
        puzzlePieces: 'Puzzleteile',
        assembly: 'Zusammensetzen',
        time: 'Zeit:',
        congratulations: 'Glückwunsch!',
        puzzleSolved: 'Sie haben das Puzzle gelöst!',
        newGame: 'Neues Spiel',
        piecesAppear: 'Die Puzzleteile erscheinen hier',
        assembleHere: 'Setzen Sie hier das Puzzle zusammen',
        puzzleInfo: 'Puzzle:',
        classicShape: 'Klassische Form',
        slidingMode: 'Schiebemodus',
        imageLoaded: 'Bild geladen! Bereit zum Starten.',
        clickToMove: 'Klicken Sie auf Teile, um sie zu verschieben',
        highscores: '🏆 Highscores',
        filterAll: 'Alle',
        filterJigsaw: '🧩 Jigsaw',
        filterSliding: '🔢 Schiebepuzzle',
        rank: '#',
        player: 'Spieler',
        country: 'Land',
        image: 'Bild',
        mode: 'Modus',
        size: 'Größe',
        date: 'Datum',
        clearAll: '🗑️ Alle löschen',
        noResults: 'Noch keine Ergebnisse vorhanden',
        storageInfo: 'Ergebnisse werden lokal gespeichert',
        storageInfoGlobal: '🌍 Globale Rangliste - Alle Spieler weltweit',
        confirmClear: 'Möchten Sie wirklich alle lokalen Ergebnisse löschen?',
        loadingResults: 'Lade Ergebnisse...',
        firebaseError: 'Fehler beim Laden der globalen Rangliste'
    },
    en: {
        title: 'Puzzle Game',
        subtitle: 'Load an image and solve the puzzle!',
        imageUpload: 'Load Image:',
        puzzleSize: 'Puzzle Size:',
        gameMode: 'Game Mode:',
        modeJigsaw: 'Classic Jigsaw',
        modeSliding: 'Sliding Puzzle',
        playerName: 'Player Name:',
        playerPlaceholder: 'Your Name',
        pieces: 'Pieces',
        startButton: 'Start Puzzle',
        shuffleButton: 'Shuffle',
        previewButton: 'Show/Hide Preview',
        resultsButton: '🏆 Results',
        preview: 'Preview',
        puzzlePieces: 'Puzzle Pieces',
        assembly: 'Assembly',
        time: 'Time:',
        congratulations: 'Congratulations!',
        puzzleSolved: 'You solved the puzzle!',
        newGame: 'New Game',
        piecesAppear: 'Puzzle pieces will appear here',
        assembleHere: 'Assemble the puzzle here',
        puzzleInfo: 'Puzzle:',
        classicShape: 'Classic Shape',
        slidingMode: 'Sliding Mode',
        imageLoaded: 'Image loaded! Ready to start.',
        clickToMove: 'Click pieces to move them',
        highscores: '🏆 Highscores',
        filterAll: 'All',
        filterJigsaw: '🧩 Jigsaw',
        filterSliding: '🔢 Sliding Puzzle',
        rank: '#',
        player: 'Player',
        country: 'Country',
        image: 'Image',
        mode: 'Mode',
        size: 'Size',
        date: 'Date',
        clearAll: '🗑️ Clear All',
        noResults: 'No results yet',
        storageInfo: 'Results are stored locally',
        storageInfoGlobal: '🌍 Global Leaderboard - All players worldwide',
        confirmClear: 'Do you really want to delete all local results?',
        loadingResults: 'Loading results...',
        firebaseError: 'Error loading global leaderboard'
    },
    pl: {
        title: 'Gra Puzzlowa',
        subtitle: 'Załaduj obraz i ułóż puzzle!',
        imageUpload: 'Załaduj obraz:',
        puzzleSize: 'Rozmiar puzzli:',
        gameMode: 'Tryb gry:',
        modeJigsaw: 'Klasyczne puzzle',
        modeSliding: 'Przesuwanka',
        playerName: 'Nazwa gracza:',
        playerPlaceholder: 'Twoje imię',
        pieces: 'Części',
        startButton: 'Rozpocznij puzzle',
        shuffleButton: 'Przemieszaj',
        previewButton: 'Pokaż/Ukryj podgląd',
        resultsButton: '🏆 Wyniki',
        preview: 'Podgląd',
        puzzlePieces: 'Części puzzli',
        assembly: 'Układanie',
        time: 'Czas:',
        congratulations: 'Gratulacje!',
        puzzleSolved: 'Ułożyłeś puzzle!',
        newGame: 'Nowa gra',
        piecesAppear: 'Części puzzli pojawią się tutaj',
        assembleHere: 'Ułóż tutaj puzzle',
        puzzleInfo: 'Puzzle:',
        classicShape: 'Klasyczny kształt',
        slidingMode: 'Tryb przesuwania',
        imageLoaded: 'Obraz załadowany! Gotowy do rozpoczęcia.',
        clickToMove: 'Kliknij części, aby je przesunąć',
        highscores: '🏆 Najlepsze wyniki',
        filterAll: 'Wszystkie',
        filterJigsaw: '🧩 Puzzle',
        filterSliding: '🔢 Przesuwanka',
        rank: '#',
        player: 'Gracz',
        country: 'Kraj',
        image: 'Obraz',
        mode: 'Tryb',
        size: 'Rozmiar',
        date: 'Data',
        clearAll: '🗑️ Wyczyść wszystko',
        noResults: 'Brak wyników',
        storageInfo: 'Wyniki są przechowywane lokalnie',
        storageInfoGlobal: '🌍 Globalna tabela wyników - Wszyscy gracze na świecie',
        confirmClear: 'Czy na pewno chcesz usunąć wszystkie lokalne wyniki?',
        loadingResults: 'Ładowanie wyników...',
        firebaseError: 'Błąd podczas ładowania globalnej tabeli wyników'
    }
};

class PuzzleGame {
    constructor() {
        this.version = PUZZLE_VERSION;
        this.currentLanguage = localStorage.getItem('puzzleLanguage') || 'de';
        this.gameMode = 'jigsaw'; // 'jigsaw' or 'sliding'
        this.image = null;
        this.imageName = ''; // Store uploaded image filename
        this.gridSize = 8;
        this.pieces = [];
        this.puzzleArea = null;
        this.startTime = null;
        this.timerInterval = null;
        this.draggedPiece = null;
        this.offsetX = 0;
        this.offsetY = 0;
        this.completedPieces = 0;
        this.isGameActive = false;
        this.tabPatterns = []; // Store tab/blank patterns for each piece
        this.emptySlot = null; // For sliding puzzle mode

        this.initElements();
        this.attachEventListeners();
        this.updateLanguage(this.currentLanguage);
        console.log(`Puzzle Game ${this.version} initialized`);
    }

    initElements() {
        this.imageUpload = document.getElementById('imageUpload');
        this.gridSizeSelect = document.getElementById('gridSize');
        this.gameModeSelect = document.getElementById('gameMode');
        this.playerNameInput = document.getElementById('playerName');
        this.startButton = document.getElementById('startButton');
        this.shuffleButton = document.getElementById('shuffleButton');
        this.showPreviewButton = document.getElementById('showPreviewButton');
        this.showResultsButton = document.getElementById('showResultsButton');
        this.piecePool = document.getElementById('piecePool');
        this.assemblyArea = document.getElementById('assemblyArea');
        this.previewCanvas = document.getElementById('previewCanvas');
        this.previewContainer = document.getElementById('previewContainer');
        this.puzzleInfo = document.getElementById('puzzleInfo');
        this.timerDisplay = document.getElementById('timer');
        this.victoryOverlay = document.getElementById('victoryOverlay');
        this.newGameButton = document.getElementById('newGameButton');
        this.resultsModal = document.getElementById('resultsModal');
        this.closeResultsButton = document.getElementById('closeResultsButton');
        this.resultsTableBody = document.getElementById('resultsTableBody');
        this.clearResultsButton = document.getElementById('clearResultsButton');

        // Load saved player name
        this.playerNameInput.value = localStorage.getItem('puzzlePlayerName') || '';
    }

    attachEventListeners() {
        this.imageUpload.addEventListener('change', (e) => this.handleImageUpload(e));
        this.startButton.addEventListener('click', () => this.startPuzzle());
        this.shuffleButton.addEventListener('click', () => this.shufflePieces());
        this.showPreviewButton.addEventListener('click', () => this.togglePreview());
        this.newGameButton.addEventListener('click', () => this.resetGame());
        this.showResultsButton.addEventListener('click', () => this.showResults());
        this.closeResultsButton.addEventListener('click', () => this.hideResults());
        this.clearResultsButton.addEventListener('click', () => this.clearResults());

        // Player name save
        this.playerNameInput.addEventListener('input', () => {
            localStorage.setItem('puzzlePlayerName', this.playerNameInput.value);
        });

        // Language switcher
        document.querySelectorAll('.lang-option').forEach(option => {
            option.addEventListener('click', () => {
                this.updateLanguage(option.dataset.lang);
            });
        });

        // Filter buttons
        document.querySelectorAll('.filter-button').forEach(button => {
            button.addEventListener('click', async () => {
                document.querySelectorAll('.filter-button').forEach(b => b.classList.remove('active'));
                button.classList.add('active');
                await this.filterResults(button.dataset.filter);
            });
        });

        // Close modal on background click
        this.resultsModal.addEventListener('click', (e) => {
            if (e.target === this.resultsModal) {
                this.hideResults();
            }
        });

        // Mouse events for drag and drop
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        document.addEventListener('mouseup', (e) => this.handleMouseUp(e));

        // Touch events for mobile support
        document.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        document.addEventListener('touchend', (e) => this.handleTouchEnd(e));
    }

    handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Store image filename (without path)
        this.imageName = file.name;

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.image = img;
                this.displayPreview();
                this.startButton.disabled = false;
                const t = TRANSLATIONS[this.currentLanguage];
                this.puzzleInfo.textContent = t.imageLoaded;
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    displayPreview() {
        const ctx = this.previewCanvas.getContext('2d');
        const maxSize = 250;
        const scale = Math.min(maxSize / this.image.width, maxSize / this.image.height);

        // Get device pixel ratio for retina displays
        const dpr = window.devicePixelRatio || 1;

        // Set display size
        const displayWidth = this.image.width * scale;
        const displayHeight = this.image.height * scale;

        // Set canvas size considering pixel ratio for sharp rendering
        this.previewCanvas.width = displayWidth * dpr;
        this.previewCanvas.height = displayHeight * dpr;

        // Set CSS size to match display size
        this.previewCanvas.style.width = displayWidth + 'px';
        this.previewCanvas.style.height = displayHeight + 'px';

        // Scale canvas context for high DPI
        ctx.scale(dpr, dpr);

        // Enable image smoothing for better quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(this.image, 0, 0, displayWidth, displayHeight);
    }

    startPuzzle() {
        if (!this.image) return;

        this.gridSize = parseInt(this.gridSizeSelect.value);
        this.gameMode = this.gameModeSelect.value;
        this.isGameActive = true;
        this.completedPieces = 0;

        // Clear previous puzzle
        this.piecePool.innerHTML = '';
        this.assemblyArea.innerHTML = '';

        if (this.gameMode === 'sliding') {
            this.startSlidingPuzzle();
        } else {
            this.startJigsawPuzzle();
        }

        // Update UI
        const t = TRANSLATIONS[this.currentLanguage];
        const totalPieces = this.gridSize * this.gridSize;
        const modeText = this.gameMode === 'sliding' ? t.slidingMode : t.classicShape;
        this.puzzleInfo.textContent = `${t.puzzleInfo} ${this.gridSize}x${this.gridSize} (${totalPieces} ${t.pieces}) - ${modeText}`;
        this.shuffleButton.disabled = false;
        this.showPreviewButton.disabled = false;

        // Start timer
        this.startTimer();
    }

    startJigsawPuzzle() {
        // Setup assembly area dimensions
        const maxWidth = this.assemblyArea.parentElement.clientWidth - 40;
        const maxHeight = 500;
        const scale = Math.min(maxWidth / this.image.width, maxHeight / this.image.height);

        this.puzzleWidth = this.image.width * scale;
        this.puzzleHeight = this.image.height * scale;

        // Add extra space for tabs
        const pieceWidth = this.puzzleWidth / this.gridSize;
        const pieceHeight = this.puzzleHeight / this.gridSize;
        const tabSize = Math.min(pieceWidth, pieceHeight) * 0.2;

        this.assemblyArea.style.width = (this.puzzleWidth + tabSize * 2) + 'px';
        this.assemblyArea.style.height = (this.puzzleHeight + tabSize * 2) + 'px';
        this.assemblyArea.style.border = '3px solid #667eea';

        // Generate puzzle pieces
        this.generatePuzzlePieces();

        // Shuffle pieces
        this.shufflePieces();
    }

    startSlidingPuzzle() {
        // Hide piece pool for sliding puzzle
        this.piecePool.parentElement.style.display = 'none';

        // Setup assembly area dimensions
        const maxWidth = this.assemblyArea.parentElement.parentElement.clientWidth - 80;
        const maxHeight = 600;
        const scale = Math.min(maxWidth / this.image.width, maxHeight / this.image.height);

        this.puzzleWidth = this.image.width * scale;
        this.puzzleHeight = this.image.height * scale;

        const pieceWidth = this.puzzleWidth / this.gridSize;
        const pieceHeight = this.puzzleHeight / this.gridSize;

        this.assemblyArea.style.width = this.puzzleWidth + 'px';
        this.assemblyArea.style.height = this.puzzleHeight + 'px';
        this.assemblyArea.style.border = '3px solid #667eea';

        // Generate sliding puzzle pieces
        this.generateSlidingPuzzlePieces();

        // Shuffle sliding puzzle
        this.shuffleSlidingPuzzle();
    }

    generateTabPatterns() {
        // Generate tab/blank patterns for all pieces
        // 0 = none (edge), 1 = tab (out), -1 = blank (in)
        this.tabPatterns = [];

        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const pattern = {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                };

                // Top edge
                if (row === 0) {
                    pattern.top = 0;
                } else {
                    // Match with piece above (opposite of its bottom)
                    const aboveIndex = (row - 1) * this.gridSize + col;
                    pattern.top = -this.tabPatterns[aboveIndex].bottom;
                }

                // Left edge
                if (col === 0) {
                    pattern.left = 0;
                } else {
                    // Match with piece to the left (opposite of its right)
                    const leftIndex = row * this.gridSize + (col - 1);
                    pattern.left = -this.tabPatterns[leftIndex].right;
                }

                // Right edge
                if (col === this.gridSize - 1) {
                    pattern.right = 0;
                } else {
                    pattern.right = Math.random() < 0.5 ? 1 : -1;
                }

                // Bottom edge
                if (row === this.gridSize - 1) {
                    pattern.bottom = 0;
                } else {
                    pattern.bottom = Math.random() < 0.5 ? 1 : -1;
                }

                this.tabPatterns.push(pattern);
            }
        }
    }

    drawPuzzleShape(ctx, width, height, pattern, tabSize) {
        ctx.beginPath();

        const neckSize = tabSize * 0.4; // Width of tab neck
        const controlOffset = tabSize * 0.4; // Bezier control point offset

        // Start from top-left
        ctx.moveTo(0, 0);

        // Top edge
        if (pattern.top === 0) {
            ctx.lineTo(width, 0);
        } else {
            const tabDirection = pattern.top;
            const midX = width / 2;

            ctx.lineTo(midX - neckSize, 0);
            ctx.bezierCurveTo(
                midX - neckSize, -tabDirection * controlOffset,
                midX - tabSize, -tabDirection * tabSize,
                midX, -tabDirection * tabSize
            );
            ctx.bezierCurveTo(
                midX + tabSize, -tabDirection * tabSize,
                midX + neckSize, -tabDirection * controlOffset,
                midX + neckSize, 0
            );
            ctx.lineTo(width, 0);
        }

        // Right edge
        if (pattern.right === 0) {
            ctx.lineTo(width, height);
        } else {
            const tabDirection = pattern.right;
            const midY = height / 2;

            ctx.lineTo(width, midY - neckSize);
            ctx.bezierCurveTo(
                width + tabDirection * controlOffset, midY - neckSize,
                width + tabDirection * tabSize, midY - tabSize,
                width + tabDirection * tabSize, midY
            );
            ctx.bezierCurveTo(
                width + tabDirection * tabSize, midY + tabSize,
                width + tabDirection * controlOffset, midY + neckSize,
                width, midY + neckSize
            );
            ctx.lineTo(width, height);
        }

        // Bottom edge
        if (pattern.bottom === 0) {
            ctx.lineTo(0, height);
        } else {
            const tabDirection = pattern.bottom;
            const midX = width / 2;

            ctx.lineTo(midX + neckSize, height);
            ctx.bezierCurveTo(
                midX + neckSize, height + tabDirection * controlOffset,
                midX + tabSize, height + tabDirection * tabSize,
                midX, height + tabDirection * tabSize
            );
            ctx.bezierCurveTo(
                midX - tabSize, height + tabDirection * tabSize,
                midX - neckSize, height + tabDirection * controlOffset,
                midX - neckSize, height
            );
            ctx.lineTo(0, height);
        }

        // Left edge
        if (pattern.left === 0) {
            ctx.lineTo(0, 0);
        } else {
            const tabDirection = pattern.left;
            const midY = height / 2;

            ctx.lineTo(0, midY + neckSize);
            ctx.bezierCurveTo(
                -tabDirection * controlOffset, midY + neckSize,
                -tabDirection * tabSize, midY + tabSize,
                -tabDirection * tabSize, midY
            );
            ctx.bezierCurveTo(
                -tabDirection * tabSize, midY - tabSize,
                -tabDirection * controlOffset, midY - neckSize,
                0, midY - neckSize
            );
            ctx.lineTo(0, 0);
        }

        ctx.closePath();
    }

    generatePuzzlePieces() {
        this.pieces = [];
        const pieceWidth = this.puzzleWidth / this.gridSize;
        const pieceHeight = this.puzzleHeight / this.gridSize;
        const tabSize = Math.min(pieceWidth, pieceHeight) * 0.2; // Tab size is 20% of piece size

        // Get device pixel ratio for retina displays (iPad, iPhone)
        const dpr = window.devicePixelRatio || 1;

        // Generate tab patterns for all pieces
        this.generateTabPatterns();

        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const patternIndex = row * this.gridSize + col;
                const pattern = this.tabPatterns[patternIndex];

                const piece = document.createElement('div');
                piece.className = 'puzzle-piece';

                // Increase piece size to accommodate tabs
                const expandedWidth = pieceWidth + tabSize * 2;
                const expandedHeight = pieceHeight + tabSize * 2;

                piece.style.width = expandedWidth + 'px';
                piece.style.height = expandedHeight + 'px';

                // Create canvas for this piece with high resolution
                const canvas = document.createElement('canvas');
                // Set canvas size with device pixel ratio for sharp rendering
                canvas.width = expandedWidth * dpr;
                canvas.height = expandedHeight * dpr;
                const ctx = canvas.getContext('2d');

                // Scale canvas context for high DPI
                ctx.scale(dpr, dpr);

                // Enable high quality image smoothing
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';

                // Draw the puzzle shape as clipping path
                ctx.save();
                ctx.translate(tabSize, tabSize);
                this.drawPuzzleShape(ctx, pieceWidth, pieceHeight, pattern, tabSize);
                ctx.clip();

                // Calculate source coordinates - need to extend beyond base piece to cover tabs
                // Each puzzle pixel corresponds to this many image pixels:
                const imagePixelsPerPuzzlePixelX = this.image.width / this.puzzleWidth;
                const imagePixelsPerPuzzlePixelY = this.image.height / this.puzzleHeight;

                // Base source coordinates for this piece
                const baseSrcX = (col * this.image.width) / this.gridSize;
                const baseSrcY = (row * this.image.height) / this.gridSize;
                const baseSrcWidth = this.image.width / this.gridSize;
                const baseSrcHeight = this.image.height / this.gridSize;

                // Extend source region to cover tab areas (convert tabSize to image pixels)
                const tabSizeInImageX = tabSize * imagePixelsPerPuzzlePixelX;
                const tabSizeInImageY = tabSize * imagePixelsPerPuzzlePixelY;

                // Calculate extended source rectangle
                let srcX = baseSrcX - tabSizeInImageX;
                let srcY = baseSrcY - tabSizeInImageY;
                let srcWidth = baseSrcWidth + (2 * tabSizeInImageX);
                let srcHeight = baseSrcHeight + (2 * tabSizeInImageY);

                // Destination position (needs to start at -tabSize to cover tabs)
                let destX = -tabSize;
                let destY = -tabSize;
                let destWidth = expandedWidth;
                let destHeight = expandedHeight;

                // Clamp source coordinates to image boundaries and adjust destination accordingly
                if (srcX < 0) {
                    destX = destX - (srcX * (pieceWidth / baseSrcWidth));
                    destWidth = destWidth + (srcX * (pieceWidth / baseSrcWidth));
                    srcWidth = srcWidth + srcX;
                    srcX = 0;
                }
                if (srcY < 0) {
                    destY = destY - (srcY * (pieceHeight / baseSrcHeight));
                    destHeight = destHeight + (srcY * (pieceHeight / baseSrcHeight));
                    srcHeight = srcHeight + srcY;
                    srcY = 0;
                }
                if (srcX + srcWidth > this.image.width) {
                    const overflow = srcX + srcWidth - this.image.width;
                    srcWidth = srcWidth - overflow;
                    destWidth = destWidth - (overflow * (pieceWidth / baseSrcWidth));
                }
                if (srcY + srcHeight > this.image.height) {
                    const overflow = srcY + srcHeight - this.image.height;
                    srcHeight = srcHeight - overflow;
                    destHeight = destHeight - (overflow * (pieceHeight / baseSrcHeight));
                }

                // Draw the extended image portion to cover tabs
                ctx.drawImage(
                    this.image,
                    srcX, srcY, srcWidth, srcHeight,
                    destX, destY, destWidth, destHeight
                );

                ctx.restore();

                // Draw outline for better visibility
                ctx.save();
                ctx.translate(tabSize, tabSize);
                this.drawPuzzleShape(ctx, pieceWidth, pieceHeight, pattern, tabSize);
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
                ctx.lineWidth = 1 / dpr; // Adjust line width for DPI
                ctx.stroke();
                ctx.restore();

                // Use high quality image format
                piece.style.backgroundImage = `url(${canvas.toDataURL('image/png', 1.0)})`;
                piece.style.backgroundSize = '100% 100%';

                // Store piece data (adjust for tab offset)
                piece.dataset.row = row;
                piece.dataset.col = col;
                piece.dataset.correctX = col * pieceWidth - tabSize;
                piece.dataset.correctY = row * pieceHeight - tabSize;

                // Attach event listeners
                piece.addEventListener('mousedown', (e) => this.handleMouseDown(e, piece));
                piece.addEventListener('touchstart', (e) => this.handleTouchStart(e, piece));

                // Add pieces to the piece pool initially
                this.piecePool.appendChild(piece);
                this.pieces.push(piece);
            }
        }
    }

    shufflePieces() {
        if (this.gameMode === 'sliding') {
            this.shuffleSlidingPuzzle();
            return;
        }

        // Jigsaw mode shuffling
        const pieceWidth = this.puzzleWidth / this.gridSize;
        const pieceHeight = this.puzzleHeight / this.gridSize;
        const tabSize = Math.min(pieceWidth, pieceHeight) * 0.2;
        const expandedWidth = pieceWidth + tabSize * 2;
        const expandedHeight = pieceHeight + tabSize * 2;
        const margin = 5;

        // Get piece pool dimensions
        const poolRect = this.piecePool.getBoundingClientRect();
        const poolWidth = poolRect.width;
        const poolHeight = poolRect.height;

        this.pieces.forEach((piece, index) => {
            if (!piece.classList.contains('correct')) {
                // Move piece to piece pool if not already there
                if (piece.parentElement !== this.piecePool) {
                    this.piecePool.appendChild(piece);
                }

                // Random position within piece pool
                const maxX = Math.max(0, poolWidth - expandedWidth - 20);
                const maxY = Math.max(0, poolHeight - expandedHeight - 20);

                const randomX = Math.random() * maxX;
                const randomY = Math.random() * maxY;

                piece.style.left = randomX + 'px';
                piece.style.top = randomY + 'px';
                piece.style.zIndex = index;
            }
        });
    }

    generateSlidingPuzzlePieces() {
        this.pieces = [];
        const pieceWidth = this.puzzleWidth / this.gridSize;
        const pieceHeight = this.puzzleHeight / this.gridSize;
        const dpr = window.devicePixelRatio || 1;

        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                // Last piece is empty slot
                if (row === this.gridSize - 1 && col === this.gridSize - 1) {
                    this.emptySlot = { row, col };
                    continue;
                }

                const piece = document.createElement('div');
                piece.className = 'sliding-piece';
                piece.style.width = pieceWidth + 'px';
                piece.style.height = pieceHeight + 'px';
                piece.style.position = 'absolute';
                piece.style.cursor = 'pointer';
                piece.style.transition = 'all 0.3s ease';

                // Create canvas for this piece
                const canvas = document.createElement('canvas');
                canvas.width = pieceWidth * dpr;
                canvas.height = pieceHeight * dpr;
                const ctx = canvas.getContext('2d');

                ctx.scale(dpr, dpr);
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';

                // Calculate source coordinates
                const srcX = (col * this.image.width) / this.gridSize;
                const srcY = (row * this.image.height) / this.gridSize;
                const srcWidth = this.image.width / this.gridSize;
                const srcHeight = this.image.height / this.gridSize;

                // Draw the image portion
                ctx.drawImage(
                    this.image,
                    srcX, srcY, srcWidth, srcHeight,
                    0, 0, pieceWidth, pieceHeight
                );

                // Draw border
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
                ctx.lineWidth = 2 / dpr;
                ctx.strokeRect(0, 0, pieceWidth, pieceHeight);

                piece.style.backgroundImage = `url(${canvas.toDataURL('image/png', 1.0)})`;
                piece.style.backgroundSize = '100% 100%';

                // Store piece data
                piece.dataset.row = row;
                piece.dataset.col = col;
                piece.dataset.correctRow = row;
                piece.dataset.correctCol = col;

                // Position piece
                piece.style.left = col * pieceWidth + 'px';
                piece.style.top = row * pieceHeight + 'px';

                // Add click listener for sliding
                piece.addEventListener('click', () => this.handleSlidingPieceClick(piece));

                this.assemblyArea.appendChild(piece);
                this.pieces.push(piece);
            }
        }
    }

    shuffleSlidingPuzzle() {
        // Perform random valid moves to shuffle
        const moves = this.gridSize * this.gridSize * 10;
        for (let i = 0; i < moves; i++) {
            const movablePieces = this.getMovableSlidingPieces();
            if (movablePieces.length > 0) {
                const randomPiece = movablePieces[Math.floor(Math.random() * movablePieces.length)];
                this.moveSlidingPiece(randomPiece, false);
            }
        }
        // Disable transitions after shuffling
        this.pieces.forEach(piece => {
            piece.style.transition = 'all 0.3s ease';
        });
    }

    getMovableSlidingPieces() {
        return this.pieces.filter(piece => {
            const row = parseInt(piece.dataset.row);
            const col = parseInt(piece.dataset.col);
            return (
                (row === this.emptySlot.row && Math.abs(col - this.emptySlot.col) === 1) ||
                (col === this.emptySlot.col && Math.abs(row - this.emptySlot.row) === 1)
            );
        });
    }

    handleSlidingPieceClick(piece) {
        const row = parseInt(piece.dataset.row);
        const col = parseInt(piece.dataset.col);

        // Check if piece is adjacent to empty slot
        const isAdjacent = (
            (row === this.emptySlot.row && Math.abs(col - this.emptySlot.col) === 1) ||
            (col === this.emptySlot.col && Math.abs(row - this.emptySlot.row) === 1)
        );

        if (isAdjacent) {
            this.moveSlidingPiece(piece, true);
            this.checkSlidingPuzzleCompletion();
        }
    }

    moveSlidingPiece(piece, animated) {
        const pieceWidth = this.puzzleWidth / this.gridSize;
        const pieceHeight = this.puzzleHeight / this.gridSize;

        // Swap piece with empty slot
        const oldRow = parseInt(piece.dataset.row);
        const oldCol = parseInt(piece.dataset.col);

        piece.dataset.row = this.emptySlot.row;
        piece.dataset.col = this.emptySlot.col;

        piece.style.left = this.emptySlot.col * pieceWidth + 'px';
        piece.style.top = this.emptySlot.row * pieceHeight + 'px';

        this.emptySlot = { row: oldRow, col: oldCol };
    }

    checkSlidingPuzzleCompletion() {
        const allCorrect = this.pieces.every(piece => {
            return piece.dataset.row === piece.dataset.correctRow &&
                   piece.dataset.col === piece.dataset.correctCol;
        });

        if (allCorrect && this.emptySlot.row === this.gridSize - 1 && this.emptySlot.col === this.gridSize - 1) {
            this.stopTimer();
            this.showVictoryScreen();
        }
    }

    handleMouseDown(event, piece) {
        if (piece.classList.contains('correct')) return;

        this.draggedPiece = piece;
        this.draggedPiece.classList.add('dragging');

        const rect = piece.getBoundingClientRect();
        this.offsetX = event.clientX - rect.left;
        this.offsetY = event.clientY - rect.top;

        // Bring to front
        piece.style.zIndex = 1000;

        event.preventDefault();
    }

    handleTouchStart(event, piece) {
        if (piece.classList.contains('correct')) return;

        const touch = event.touches[0];
        this.draggedPiece = piece;
        this.draggedPiece.classList.add('dragging');

        const rect = piece.getBoundingClientRect();
        this.offsetX = touch.clientX - rect.left;
        this.offsetY = touch.clientY - rect.top;

        piece.style.zIndex = 1000;

        // iOS Safari: Prevent default to avoid scrolling during drag
        event.preventDefault();
        event.stopPropagation();
    }

    handleMouseMove(event) {
        if (!this.draggedPiece) return;

        // Determine which container to use for positioning
        const container = this.draggedPiece.parentElement;
        const containerRect = container.getBoundingClientRect();
        const x = event.clientX - containerRect.left - this.offsetX;
        const y = event.clientY - containerRect.top - this.offsetY;

        this.draggedPiece.style.left = x + 'px';
        this.draggedPiece.style.top = y + 'px';

        event.preventDefault();
    }

    handleTouchMove(event) {
        if (!this.draggedPiece) return;

        const touch = event.touches[0];
        const container = this.draggedPiece.parentElement;
        const containerRect = container.getBoundingClientRect();
        const x = touch.clientX - containerRect.left - this.offsetX;
        const y = touch.clientY - containerRect.top - this.offsetY;

        // Use transform for better performance on iOS
        this.draggedPiece.style.left = x + 'px';
        this.draggedPiece.style.top = y + 'px';

        // iOS Safari: Prevent scrolling and other default behaviors
        event.preventDefault();
        event.stopPropagation();
    }

    handleMouseUp(event) {
        if (!this.draggedPiece) return;

        this.handlePieceDrop(event.clientX, event.clientY);
        this.draggedPiece.classList.remove('dragging');
        this.draggedPiece = null;
    }

    handleTouchEnd(event) {
        if (!this.draggedPiece) return;

        const touch = event.changedTouches[0];
        this.handlePieceDrop(touch.clientX, touch.clientY);
        this.draggedPiece.classList.remove('dragging');
        this.draggedPiece = null;

        // iOS Safari: Prevent ghost click and other default behaviors
        event.preventDefault();
        event.stopPropagation();
    }

    handlePieceDrop(clientX, clientY) {
        // Check if the piece is dropped over the assembly area
        const assemblyRect = this.assemblyArea.getBoundingClientRect();
        const isOverAssembly = (
            clientX >= assemblyRect.left &&
            clientX <= assemblyRect.right &&
            clientY >= assemblyRect.top &&
            clientY <= assemblyRect.bottom
        );

        if (isOverAssembly && this.draggedPiece.parentElement !== this.assemblyArea) {
            // Move piece to assembly area
            const pieceRect = this.draggedPiece.getBoundingClientRect();

            // Calculate new position relative to assembly area
            const newX = pieceRect.left - assemblyRect.left;
            const newY = pieceRect.top - assemblyRect.top;

            this.assemblyArea.appendChild(this.draggedPiece);
            this.draggedPiece.style.left = newX + 'px';
            this.draggedPiece.style.top = newY + 'px';
        }

        // Check if piece is in correct position (only if in assembly area)
        if (this.draggedPiece.parentElement === this.assemblyArea) {
            this.checkPiecePlacement();
        }
    }

    checkPiecePlacement() {
        const currentX = parseFloat(this.draggedPiece.style.left);
        const currentY = parseFloat(this.draggedPiece.style.top);
        const correctX = parseFloat(this.draggedPiece.dataset.correctX);
        const correctY = parseFloat(this.draggedPiece.dataset.correctY);

        const pieceWidth = this.puzzleWidth / this.gridSize;
        const pieceHeight = this.puzzleHeight / this.gridSize;

        // Snap threshold (20% of piece size)
        const snapThreshold = Math.min(pieceWidth, pieceHeight) * 0.2;

        const distanceX = Math.abs(currentX - correctX);
        const distanceY = Math.abs(currentY - correctY);

        if (distanceX < snapThreshold && distanceY < snapThreshold) {
            // Snap to correct position
            this.draggedPiece.style.left = correctX + 'px';
            this.draggedPiece.style.top = correctY + 'px';
            this.draggedPiece.classList.add('correct');
            this.draggedPiece.style.cursor = 'default';
            this.draggedPiece.style.zIndex = 1;

            this.completedPieces++;
            this.checkVictory();
        }
    }

    checkVictory() {
        const totalPieces = this.gridSize * this.gridSize;

        if (this.completedPieces === totalPieces) {
            this.stopTimer();
            this.showVictoryScreen();
        }
    }

    showVictoryScreen() {
        const victoryTime = document.getElementById('victoryTime');
        const timeString = this.timerDisplay.textContent.split(': ')[1];
        victoryTime.textContent = `Zeit: ${timeString}`;

        // Save result
        this.saveResult(timeString);

        this.victoryOverlay.classList.add('show');
    }

    togglePreview() {
        this.previewContainer.classList.toggle('hidden');
    }

    startTimer() {
        this.startTime = Date.now();
        const t = TRANSLATIONS[this.currentLanguage];
        this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
            const seconds = (elapsed % 60).toString().padStart(2, '0');
            this.timerDisplay.textContent = `${t.time} ${minutes}:${seconds}`;
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    updateLanguage(lang) {
        console.log('Switching to language:', lang);
        this.currentLanguage = lang;
        localStorage.setItem('puzzleLanguage', lang);
        const t = TRANSLATIONS[lang];

        try {
            // Update all UI text elements
            const headerH1 = document.querySelector('header h1');
            if (headerH1) {
                headerH1.innerHTML = `🧩 ${t.title} <span class="version">v${this.version.substring(1)}</span>`;
            }

            const headerP = document.querySelector('header p');
            if (headerP) {
                headerP.textContent = t.subtitle;
            }

            const imageLabel = document.querySelector('label[for="imageUpload"]');
            if (imageLabel) {
                imageLabel.textContent = t.imageUpload;
            }

            const sizeLabel = document.querySelector('label[for="gridSize"]');
            if (sizeLabel) {
                sizeLabel.textContent = t.puzzleSize;
            }

            const modeLabel = document.querySelector('label[for="gameMode"]');
            if (modeLabel) {
                modeLabel.textContent = t.gameMode;
            }

            const playerNameLabel = document.querySelector('label[for="playerName"]');
            if (playerNameLabel) {
                playerNameLabel.textContent = t.playerName;
            }

            if (this.playerNameInput) {
                this.playerNameInput.placeholder = t.playerPlaceholder;
            }

            // Update game mode select options
            const gameModeOptions = document.querySelectorAll('#gameMode option');
            if (gameModeOptions.length >= 2) {
                gameModeOptions[0].textContent = t.modeJigsaw;
                gameModeOptions[1].textContent = t.modeSliding;
            }

            if (this.startButton) this.startButton.textContent = t.startButton;
            if (this.shuffleButton) this.shuffleButton.textContent = t.shuffleButton;
            if (this.showPreviewButton) this.showPreviewButton.textContent = t.previewButton;
            if (this.showResultsButton) this.showResultsButton.textContent = t.resultsButton;

            const previewH3 = document.querySelector('.preview-container h3');
            if (previewH3) {
                previewH3.textContent = t.preview;
            }

            const piecePoolH3 = document.querySelector('.piece-pool-wrapper h3');
            if (piecePoolH3) {
                piecePoolH3.textContent = t.puzzlePieces;
            }

            const assemblyH3 = document.querySelector('.assembly-area-wrapper h3');
            if (assemblyH3) {
                assemblyH3.textContent = t.assembly;
            }

            const victoryH2 = document.querySelector('.victory-message h2');
            if (victoryH2) {
                victoryH2.textContent = `🎉 ${t.congratulations} 🎉`;
            }

            const victoryP = document.querySelector('.victory-message p:nth-child(2)');
            if (victoryP) {
                victoryP.textContent = t.puzzleSolved;
            }

            if (this.newGameButton) this.newGameButton.textContent = t.newGame;

            // Update drop messages
            const piecePoolMsg = this.piecePool.querySelector('.drop-message');
            if (piecePoolMsg) piecePoolMsg.textContent = t.piecesAppear;
            const assemblyMsg = this.assemblyArea.querySelector('.drop-message');
            if (assemblyMsg) assemblyMsg.textContent = t.assembleHere;

            // Update timer display
            if (!this.isGameActive && this.timerDisplay) {
                this.timerDisplay.textContent = `${t.time} 00:00`;
            }

            // Update language selector active state
            document.querySelectorAll('.lang-option').forEach(option => {
                option.classList.toggle('active', option.dataset.lang === lang);
            });

            // Update results modal
            const resultsHeader = document.querySelector('.results-header h2');
            if (resultsHeader) {
                resultsHeader.textContent = t.highscores;
            }

            const filterButtons = document.querySelectorAll('.filter-button');
            if (filterButtons.length >= 3) {
                filterButtons[0].textContent = t.filterAll;
                filterButtons[1].textContent = t.filterJigsaw;
                filterButtons[2].textContent = t.filterSliding;
            }

            const resultsTh = document.querySelectorAll('.results-table th');
            if (resultsTh.length >= 8) {
                resultsTh[0].textContent = t.rank;
                resultsTh[1].textContent = t.player;
                resultsTh[2].textContent = t.country;
                resultsTh[3].textContent = t.image;
                resultsTh[4].textContent = t.mode;
                resultsTh[5].textContent = t.size;
                resultsTh[6].textContent = t.time;
                resultsTh[7].textContent = t.date;
            }

            if (this.clearResultsButton) {
                this.clearResultsButton.textContent = t.clearAll;
            }

            // Update storage info based on Firebase availability
            this.updateStorageInfo();

            // Refresh results if modal is open
            if (this.resultsModal.classList.contains('show')) {
                const activeFilter = document.querySelector('.filter-button.active');
                this.filterResults(activeFilter ? activeFilter.dataset.filter : 'all');
            }

            console.log('Language switched successfully to:', lang);
        } catch (error) {
            console.error('Error updating language:', error);
        }
    }

    resetGame() {
        this.stopTimer();
        this.victoryOverlay.classList.remove('show');
        const t = TRANSLATIONS[this.currentLanguage];
        this.piecePool.innerHTML = `<div class="drop-message">${t.piecesAppear}</div>`;
        this.assemblyArea.innerHTML = `<div class="drop-message">${t.assembleHere}</div>`;

        // Restore piece pool visibility (hidden in sliding mode)
        if (this.piecePool.parentElement) {
            this.piecePool.parentElement.style.display = '';
        }

        this.imageUpload.value = '';
        this.image = null;
        this.pieces = [];
        this.completedPieces = 0;
        this.isGameActive = false;
        this.gameMode = 'jigsaw';
        this.emptySlot = null;
        this.startButton.disabled = true;
        this.shuffleButton.disabled = true;
        this.showPreviewButton.disabled = true;
        this.puzzleInfo.textContent = '';
        this.timerDisplay.textContent = `${t.time} 00:00`;
        this.previewCanvas.width = 0;
        this.previewCanvas.height = 0;
    }

    // Helper function to get country flag based on browser language
    getCountryFlag() {
        const lang = navigator.language || navigator.userLanguage || 'en';
        const countryCode = lang.split('-')[1] || lang.split('_')[1];

        // Map language codes to flags
        const flagMap = {
            'de': '🇩🇪', 'DE': '🇩🇪',
            'en': '🇬🇧', 'GB': '🇬🇧', 'US': '🇺🇸', 'AU': '🇦🇺', 'CA': '🇨🇦',
            'pl': '🇵🇱', 'PL': '🇵🇱',
            'fr': '🇫🇷', 'FR': '🇫🇷',
            'es': '🇪🇸', 'ES': '🇪🇸',
            'it': '🇮🇹', 'IT': '🇮🇹',
            'nl': '🇳🇱', 'NL': '🇳🇱',
            'pt': '🇵🇹', 'PT': '🇵🇹', 'BR': '🇧🇷',
            'ru': '🇷🇺', 'RU': '🇷🇺',
            'ja': '🇯🇵', 'JP': '🇯🇵',
            'zh': '🇨🇳', 'CN': '🇨🇳',
            'ko': '🇰🇷', 'KR': '🇰🇷',
            'ar': '🇸🇦', 'SA': '🇸🇦',
            'tr': '🇹🇷', 'TR': '🇹🇷',
            'sv': '🇸🇪', 'SE': '🇸🇪',
            'no': '🇳🇴', 'NO': '🇳🇴',
            'da': '🇩🇰', 'DK': '🇩🇰',
            'fi': '🇫🇮', 'FI': '🇫🇮',
            'cs': '🇨🇿', 'CZ': '🇨🇿',
            'sk': '🇸🇰', 'SK': '🇸🇰',
            'hu': '🇭🇺', 'HU': '🇭🇺',
            'ro': '🇷🇴', 'RO': '🇷🇴',
            'el': '🇬🇷', 'GR': '🇬🇷',
            'uk': '🇺🇦', 'UA': '🇺🇦',
            'he': '🇮🇱', 'IL': '🇮🇱',
            'th': '🇹🇭', 'TH': '🇹🇭',
            'vi': '🇻🇳', 'VN': '🇻🇳',
            'id': '🇮🇩', 'ID': '🇮🇩'
        };

        // Try country code first, then language code
        return flagMap[countryCode] || flagMap[lang.split('-')[0]] || '🌍';
    }

    // Highscore methods
    async saveResult(timeString) {
        const playerName = this.playerNameInput.value.trim() || 'Anonym';
        const result = {
            player: playerName,
            country: this.getCountryFlag(),
            image: this.imageName || 'Unknown',
            mode: this.gameMode,
            size: `${this.gridSize}x${this.gridSize}`,
            time: timeString,
            timeSeconds: this.convertTimeToSeconds(timeString),
            date: new Date().toLocaleDateString(this.currentLanguage),
            timestamp: Date.now()
        };

        // Save to Firebase if available
        if (isFirebaseEnabled) {
            try {
                await addDoc(collection(db, 'highscores'), result);
                console.log('🌍 Result saved to global leaderboard:', result);
            } catch (error) {
                console.error('Error saving to Firebase, falling back to localStorage:', error);
                this.saveToLocalStorage(result);
            }
        } else {
            // Fallback to localStorage
            this.saveToLocalStorage(result);
        }
    }

    saveToLocalStorage(result) {
        let results = this.getLocalResults();
        results.push(result);
        results.sort((a, b) => a.timeSeconds - b.timeSeconds);
        localStorage.setItem('puzzleResults', JSON.stringify(results));
        console.log('💾 Result saved locally:', result);
    }

    convertTimeToSeconds(timeString) {
        const [minutes, seconds] = timeString.split(':').map(Number);
        return minutes * 60 + seconds;
    }

    getLocalResults() {
        try {
            const stored = localStorage.getItem('puzzleResults');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading local results:', error);
            return [];
        }
    }

    async getFirebaseResults() {
        try {
            const q = query(
                collection(db, 'highscores'),
                orderBy('timeSeconds', 'asc'),
                limit(100) // Top 100 results
            );
            const querySnapshot = await getDocs(q);
            const results = [];
            querySnapshot.forEach((doc) => {
                results.push(doc.data());
            });
            console.log('🌍 Loaded global results:', results.length);
            return results;
        } catch (error) {
            console.error('Error loading Firebase results:', error);
            throw error;
        }
    }

    async getResults() {
        if (isFirebaseEnabled) {
            try {
                return await this.getFirebaseResults();
            } catch (error) {
                console.warn('Firebase failed, using localStorage fallback');
                return this.getLocalResults();
            }
        } else {
            return this.getLocalResults();
        }
    }

    async showResults() {
        this.resultsModal.classList.add('show');
        await this.filterResults('all');
        this.updateStorageInfo();
    }

    hideResults() {
        this.resultsModal.classList.remove('show');
    }

    async filterResults(filter) {
        const t = TRANSLATIONS[this.currentLanguage];

        // Show loading state
        this.resultsTableBody.innerHTML = `
            <tr class="no-results">
                <td colspan="8">${t.loadingResults}</td>
            </tr>
        `;

        try {
            const results = await this.getResults();

            let filtered = results;
            if (filter === 'jigsaw') {
                filtered = results.filter(r => r.mode === 'jigsaw');
            } else if (filter === 'sliding') {
                filtered = results.filter(r => r.mode === 'sliding');
            }

            // Display filtered results
            if (filtered.length === 0) {
                this.resultsTableBody.innerHTML = `
                    <tr class="no-results">
                        <td colspan="8">${t.noResults}</td>
                    </tr>
                `;
                return;
            }

            this.resultsTableBody.innerHTML = filtered.map((result, index) => {
                const modeText = result.mode === 'jigsaw' ? '🧩 ' + t.modeJigsaw : '🔢 ' + t.modeSliding;
                const rankClass = index < 3 ? `rank-${index + 1}` : '';
                const medal = index === 0 ? '🥇 ' : (index === 1 ? '🥈 ' : (index === 2 ? '🥉 ' : ''));
                const country = result.country || '🌍';
                const imageName = result.image || 'Unknown';
                // Truncate long filenames
                const displayImage = imageName.length > 20 ? imageName.substring(0, 17) + '...' : imageName;

                return `
                    <tr class="${rankClass}">
                        <td>${medal}${index + 1}</td>
                        <td>${this.escapeHtml(result.player)}</td>
                        <td>${country}</td>
                        <td title="${this.escapeHtml(imageName)}">${this.escapeHtml(displayImage)}</td>
                        <td>${modeText}</td>
                        <td>${result.size}</td>
                        <td>${result.time}</td>
                        <td>${result.date}</td>
                    </tr>
                `;
            }).join('');
        } catch (error) {
            console.error('Error filtering results:', error);
            this.resultsTableBody.innerHTML = `
                <tr class="no-results">
                    <td colspan="8">${t.firebaseError}</td>
                </tr>
            `;
        }
    }

    updateStorageInfo() {
        const t = TRANSLATIONS[this.currentLanguage];
        const storageInfo = document.querySelector('.storage-info');
        if (storageInfo) {
            storageInfo.textContent = isFirebaseEnabled ? t.storageInfoGlobal : t.storageInfo;
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    async clearResults() {
        const t = TRANSLATIONS[this.currentLanguage];

        // Only clear local results, not Firebase
        if (isFirebaseEnabled) {
            if (confirm(t.confirmClear + '\n\n(Globale Ergebnisse bleiben erhalten)')) {
                localStorage.removeItem('puzzleResults');
                console.log('Local results cleared');
            }
        } else {
            if (confirm(t.confirmClear)) {
                localStorage.removeItem('puzzleResults');
                await this.filterResults('all');
                console.log('All local results cleared');
            }
        }
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new PuzzleGame();
});
