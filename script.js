// Puzzle Game State
class PuzzleGame {
    constructor() {
        this.image = null;
        this.gridSize = 10;
        this.pieces = [];
        this.puzzleArea = null;
        this.startTime = null;
        this.timerInterval = null;
        this.draggedPiece = null;
        this.offsetX = 0;
        this.offsetY = 0;
        this.completedPieces = 0;
        this.isGameActive = false;

        this.initElements();
        this.attachEventListeners();
    }

    initElements() {
        this.imageUpload = document.getElementById('imageUpload');
        this.gridSizeSelect = document.getElementById('gridSize');
        this.startButton = document.getElementById('startButton');
        this.shuffleButton = document.getElementById('shuffleButton');
        this.showPreviewButton = document.getElementById('showPreviewButton');
        this.puzzleArea = document.getElementById('puzzleArea');
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
                this.puzzleInfo.textContent = 'Bild geladen! Bereit zum Starten.';
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    displayPreview() {
        const ctx = this.previewCanvas.getContext('2d');
        const maxSize = 250;
        const scale = Math.min(maxSize / this.image.width, maxSize / this.image.height);

        this.previewCanvas.width = this.image.width * scale;
        this.previewCanvas.height = this.image.height * scale;

        ctx.drawImage(this.image, 0, 0, this.previewCanvas.width, this.previewCanvas.height);
    }

    startPuzzle() {
        if (!this.image) return;

        this.gridSize = parseInt(this.gridSizeSelect.value);
        this.isGameActive = true;
        this.completedPieces = 0;

        // Clear previous puzzle
        this.puzzleArea.innerHTML = '';

        // Setup puzzle area dimensions
        const maxWidth = this.puzzleArea.parentElement.clientWidth - 40;
        const maxHeight = 600;
        const scale = Math.min(maxWidth / this.image.width, maxHeight / this.image.height);

        this.puzzleWidth = this.image.width * scale;
        this.puzzleHeight = this.image.height * scale;

        this.puzzleArea.style.width = this.puzzleWidth + 'px';
        this.puzzleArea.style.height = this.puzzleHeight + 'px';
        this.puzzleArea.style.border = '3px solid #667eea';

        // Generate puzzle pieces
        this.generatePuzzlePieces();

        // Shuffle pieces
        this.shufflePieces();

        // Update UI
        const totalPieces = this.gridSize * this.gridSize;
        this.puzzleInfo.textContent = `Puzzle: ${this.gridSize}x${this.gridSize} (${totalPieces} Teile)`;
        this.shuffleButton.disabled = false;
        this.showPreviewButton.disabled = false;

        // Start timer
        this.startTimer();
    }

    generatePuzzlePieces() {
        this.pieces = [];
        const pieceWidth = this.puzzleWidth / this.gridSize;
        const pieceHeight = this.puzzleHeight / this.gridSize;

        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const piece = document.createElement('div');
                piece.className = 'puzzle-piece';
                piece.style.width = pieceWidth + 'px';
                piece.style.height = pieceHeight + 'px';

                // Create canvas for this piece
                const canvas = document.createElement('canvas');
                canvas.width = pieceWidth;
                canvas.height = pieceHeight;
                const ctx = canvas.getContext('2d');

                // Calculate source coordinates
                const srcX = (col * this.image.width) / this.gridSize;
                const srcY = (row * this.image.height) / this.gridSize;
                const srcWidth = this.image.width / this.gridSize;
                const srcHeight = this.image.height / this.gridSize;

                // Draw the piece
                ctx.drawImage(
                    this.image,
                    srcX, srcY, srcWidth, srcHeight,
                    0, 0, pieceWidth, pieceHeight
                );

                piece.style.backgroundImage = `url(${canvas.toDataURL()})`;
                piece.style.backgroundSize = '100% 100%';

                // Store piece data
                piece.dataset.row = row;
                piece.dataset.col = col;
                piece.dataset.correctX = col * pieceWidth;
                piece.dataset.correctY = row * pieceHeight;

                // Attach event listeners
                piece.addEventListener('mousedown', (e) => this.handleMouseDown(e, piece));
                piece.addEventListener('touchstart', (e) => this.handleTouchStart(e, piece));

                this.puzzleArea.appendChild(piece);
                this.pieces.push(piece);
            }
        }
    }

    shufflePieces() {
        const pieceWidth = this.puzzleWidth / this.gridSize;
        const pieceHeight = this.puzzleHeight / this.gridSize;
        const margin = 5;

        this.pieces.forEach((piece, index) => {
            if (!piece.classList.contains('correct')) {
                // Random position within puzzle area
                const maxX = this.puzzleWidth - pieceWidth;
                const maxY = this.puzzleHeight - pieceHeight;

                const randomX = Math.random() * maxX;
                const randomY = Math.random() * maxY;

                piece.style.left = randomX + 'px';
                piece.style.top = randomY + 'px';
                piece.style.zIndex = index;
            }
        });
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

        event.preventDefault();
    }

    handleMouseMove(event) {
        if (!this.draggedPiece) return;

        const puzzleRect = this.puzzleArea.getBoundingClientRect();
        const x = event.clientX - puzzleRect.left - this.offsetX;
        const y = event.clientY - puzzleRect.top - this.offsetY;

        this.draggedPiece.style.left = x + 'px';
        this.draggedPiece.style.top = y + 'px';

        event.preventDefault();
    }

    handleTouchMove(event) {
        if (!this.draggedPiece) return;

        const touch = event.touches[0];
        const puzzleRect = this.puzzleArea.getBoundingClientRect();
        const x = touch.clientX - puzzleRect.left - this.offsetX;
        const y = touch.clientY - puzzleRect.top - this.offsetY;

        this.draggedPiece.style.left = x + 'px';
        this.draggedPiece.style.top = y + 'px';

        event.preventDefault();
    }

    handleMouseUp(event) {
        if (!this.draggedPiece) return;

        this.checkPiecePlacement();
        this.draggedPiece.classList.remove('dragging');
        this.draggedPiece = null;
    }

    handleTouchEnd(event) {
        if (!this.draggedPiece) return;

        this.checkPiecePlacement();
        this.draggedPiece.classList.remove('dragging');
        this.draggedPiece = null;
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
        this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
            const seconds = (elapsed % 60).toString().padStart(2, '0');
            this.timerDisplay.textContent = `Zeit: ${minutes}:${seconds}`;
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    resetGame() {
        this.stopTimer();
        this.victoryOverlay.classList.remove('show');
        this.puzzleArea.innerHTML = '<div class="drop-message">Laden Sie ein Bild und klicken Sie auf "Puzzle starten"</div>';
        this.imageUpload.value = '';
        this.image = null;
        this.pieces = [];
        this.completedPieces = 0;
        this.isGameActive = false;
        this.startButton.disabled = true;
        this.shuffleButton.disabled = true;
        this.showPreviewButton.disabled = true;
        this.puzzleInfo.textContent = '';
        this.timerDisplay.textContent = 'Zeit: 00:00';
        this.previewCanvas.width = 0;
        this.previewCanvas.height = 0;
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new PuzzleGame();
});
