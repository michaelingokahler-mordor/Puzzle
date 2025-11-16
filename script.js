// Puzzle Game State
const PUZZLE_VERSION = 'v0.92';

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
        pieces: 'Teile',
        startButton: 'Puzzle starten',
        shuffleButton: 'Neu mischen',
        previewButton: 'Vorschau anzeigen/ausblenden',
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
        clickToMove: 'Klicken Sie auf Teile, um sie zu verschieben'
    },
    en: {
        title: 'Puzzle Game',
        subtitle: 'Load an image and solve the puzzle!',
        imageUpload: 'Load Image:',
        puzzleSize: 'Puzzle Size:',
        gameMode: 'Game Mode:',
        modeJigsaw: 'Classic Jigsaw',
        modeSliding: 'Sliding Puzzle',
        pieces: 'Pieces',
        startButton: 'Start Puzzle',
        shuffleButton: 'Shuffle',
        previewButton: 'Show/Hide Preview',
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
        clickToMove: 'Click pieces to move them'
    },
    pl: {
        title: 'Gra Puzzlowa',
        subtitle: 'Załaduj obraz i ułóż puzzle!',
        imageUpload: 'Załaduj obraz:',
        puzzleSize: 'Rozmiar puzzli:',
        gameMode: 'Tryb gry:',
        modeJigsaw: 'Klasyczne puzzle',
        modeSliding: 'Przesuwanka',
        pieces: 'Części',
        startButton: 'Rozpocznij puzzle',
        shuffleButton: 'Przemieszaj',
        previewButton: 'Pokaż/Ukryj podgląd',
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
        clickToMove: 'Kliknij części, aby je przesunąć'
    }
};

class PuzzleGame {
    constructor() {
        this.version = PUZZLE_VERSION;
        this.currentLanguage = localStorage.getItem('puzzleLanguage') || 'de';
        this.gameMode = 'jigsaw'; // 'jigsaw' or 'sliding'
        this.image = null;
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
        this.startButton = document.getElementById('startButton');
        this.shuffleButton = document.getElementById('shuffleButton');
        this.showPreviewButton = document.getElementById('showPreviewButton');
        this.piecePool = document.getElementById('piecePool');
        this.assemblyArea = document.getElementById('assemblyArea');
        this.previewCanvas = document.getElementById('previewCanvas');
        this.previewContainer = document.getElementById('previewContainer');
        this.puzzleInfo = document.getElementById('puzzleInfo');
        this.timerDisplay = document.getElementById('timer');
        this.victoryOverlay = document.getElementById('victoryOverlay');
        this.newGameButton = document.getElementById('newGameButton');
    }

    attachEventListeners() {
        this.imageUpload.addEventListener('change', (e) => this.handleImageUpload(e));
        this.startButton.addEventListener('click', () => this.startPuzzle());
        this.shuffleButton.addEventListener('click', () => this.shufflePieces());
        this.showPreviewButton.addEventListener('click', () => this.togglePreview());
        this.newGameButton.addEventListener('click', () => this.resetGame());

        // Language switcher
        document.querySelectorAll('.lang-option').forEach(option => {
            option.addEventListener('click', () => {
                this.updateLanguage(option.dataset.lang);
            });
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
        victoryTime.textContent = `Zeit: ${this.timerDisplay.textContent.split(': ')[1]}`;
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

            // Update game mode select options
            const gameModeOptions = document.querySelectorAll('#gameMode option');
            if (gameModeOptions.length >= 2) {
                gameModeOptions[0].textContent = t.modeJigsaw;
                gameModeOptions[1].textContent = t.modeSliding;
            }

            if (this.startButton) this.startButton.textContent = t.startButton;
            if (this.shuffleButton) this.shuffleButton.textContent = t.shuffleButton;
            if (this.showPreviewButton) this.showPreviewButton.textContent = t.previewButton;

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
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new PuzzleGame();
});
