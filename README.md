# 🧩 Puzzle Spiel - Drag & Drop

**Version: v0.93**

Ein interaktives Puzzle-Spiel, bei dem Sie beliebige Bilder laden und als Puzzle mit mindestens 100 Teilen zusammensetzen können.

## Features

- ✨ **Beliebige Bilder laden**: Unterstützt alle gängigen Bildformate (JPG, PNG, GIF, etc.)
- 🎮 **Zwei Spielmodi**:
  - 🧩 **Klassisches Puzzle**: Echte Jigsaw-Puzzle-Teile mit ineinandergreifenden Tabs und Blanks
  - 🔢 **Schiebepuzzle**: 15-Puzzle-Stil, bei dem Teile durch Klicken verschoben werden
- 🎯 **Mehrere Schwierigkeitsstufen**:
  - 3x3 (9 Teile) - Ideal für Schiebepuzzle
  - 4x4 (16 Teile) - Klassisches 15-Puzzle
  - 5x5 (25 Teile)
  - 6x6 (36 Teile)
  - 8x8 (64 Teile)
  - 10x10 (100 Teile)
  - 12x12 (144 Teile)
  - 15x15 (225 Teile)
  - 20x20 (400 Teile)
- 🎨 **Zwei Spielbereiche**: Getrennte Bereiche für Puzzleteile und Zusammensetzen (Jigsaw-Modus)
- 🖱️ **Drag & Drop**: Intuitive Steuerung mit Maus oder Touch (Jigsaw-Modus)
- 🖱️ **Click-to-Move**: Einfaches Klicken zum Verschieben (Schiebepuzzle-Modus)
- 🔄 **Automatisches Einrasten**: Teile rasten automatisch ein, wenn sie nahe der richtigen Position sind
- ⏱️ **Timer**: Verfolgen Sie Ihre Lösungszeit
- 👀 **Vorschau**: Ein-/Ausblendbare Bildvorschau als Hilfe
- 🎉 **Siegesbildschirm**: Feiert Ihren Erfolg mit Zeit-Anzeige
- 🌐 **Mehrsprachig**: Deutsch, Englisch und Polnisch
- 📱 **Responsive Design**: Funktioniert auf Desktop, Tablet und Smartphone

## Installation

Keine Installation erforderlich! Das Spiel läuft komplett im Browser.

### Verwendung

1. Öffnen Sie die `index.html` Datei in einem modernen Webbrowser
2. Klicken Sie auf "Bild laden" und wählen Sie ein Bild von Ihrem Computer
3. Wählen Sie die gewünschte Puzzle-Größe (Standard: 10x10 = 100 Teile)
4. Klicken Sie auf "Puzzle starten"
5. Die Puzzleteile erscheinen im linken Bereich (Puzzleteile)
6. Ziehen Sie die Teile in den rechten Bereich (Zusammensetzen) und positionieren Sie sie
7. Teile rasten automatisch ein, wenn sie nah genug an der richtigen Position sind
8. Das Spiel ist gewonnen, wenn alle Teile korrekt platziert sind

## Steuerung

### Desktop
- **Linke Maustaste + Ziehen**: Puzzle-Teil bewegen
- **Vorschau-Button**: Originalbild ein-/ausblenden
- **Neu mischen**: Puzzle-Teile neu anordnen

### Mobile/Tablet
- **Touch + Ziehen**: Puzzle-Teil bewegen
- Alle anderen Funktionen funktionieren wie auf Desktop

## Technische Details

### Dateien
- `index.html` - Hauptstruktur der Anwendung
- `style.css` - Styling und Layout
- `script.js` - Spiellogik und Funktionalität

### Technologien
- HTML5
- CSS3 (mit Flexbox und Animationen)
- Vanilla JavaScript (ES6+)
- Canvas API für Bildbearbeitung

### Browser-Unterstützung
- Chrome/Edge (empfohlen)
- Firefox
- Safari
- Opera

Alle modernen Browser werden unterstützt. JavaScript muss aktiviert sein.

## Spiellogik

### Puzzle-Generierung
1. Das geladene Bild wird in ein Raster der gewählten Größe aufgeteilt
2. Für jedes Teil wird ein zufälliges Tab/Blank-Muster generiert
3. Benachbarte Teile haben komplementäre Muster (Tab passt zu Blank)
4. Jedes Teil wird mit Canvas als klassische Puzzle-Form ausgeschnitten
5. Die Form wird mit Bezier-Kurven gezeichnet für realistische Tabs und Blanks
6. Die Teile werden zufällig im Puzzleteile-Bereich verteilt

### Klassische Puzzle-Formen
- **Tabs (Knubbel)**: Hervorstehende runde Teile an den Kanten
- **Blanks (Einbuchtungen)**: Einbuchtungen, in die Tabs passen
- **Kanten**: Gerade Linien an den Außenkanten des Puzzles
- Jedes Teil hat eine einzigartige Kombination aus Tabs, Blanks und Kanten
- Die Teile greifen wie bei einem echten Puzzle ineinander

### Zwei-Bereich-System
- **Puzzleteile-Bereich**: Alle gemischten Teile werden hier angezeigt
- **Zusammensetz-Bereich**: Leerer Bereich zum Zusammensetzen des Puzzles
- Teile können per Drag & Drop zwischen beiden Bereichen bewegt werden

### Einrast-Mechanismus
- Teile rasten ein, wenn sie innerhalb von 20% der Teilgröße zur korrekten Position sind
- Einrasten funktioniert nur im Zusammensetz-Bereich
- Eingerastete Teile werden mit einem grünen Rahmen markiert
- Eingerastete Teile können nicht mehr bewegt werden

### Sieg-Bedingung
Das Spiel ist gewonnen, wenn alle Teile korrekt platziert wurden. Ein Siegesbildschirm zeigt die benötigte Zeit an.

## Anpassungen

### Puzzle-Größen ändern
In `index.html` können Sie weitere Puzzle-Größen hinzufügen:

```html
<select id="gridSize">
    <option value="10">10x10 (100 Teile)</option>
    <option value="25">25x25 (625 Teile)</option> <!-- Neue Größe -->
</select>
```

### Farben anpassen
In `style.css` können Sie das Farbschema ändern:

```css
/* Haupt-Farbverlauf */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Button-Farbe */
button {
    background: #667eea;
}
```

### Einrast-Schwellenwert ändern
In `script.js`, Zeile ~265:

```javascript
// Standardwert: 0.2 (20% der Teilgröße)
const snapThreshold = Math.min(pieceWidth, pieceHeight) * 0.2;
```

## Entwicklung

### Projekt-Struktur
```
Puzzle/
├── index.html      # HTML-Struktur
├── style.css       # Styling
├── script.js       # Spiellogik
└── README.md       # Diese Datei
```

### Hauptklasse: PuzzleGame
Die gesamte Spiellogik ist in der `PuzzleGame` Klasse gekapselt:

- `handleImageUpload()` - Verarbeitet Bild-Uploads
- `generatePuzzlePieces()` - Erstellt Puzzle-Teile
- `shufflePieces()` - Mischt Teile zufällig
- `handleMouseDown/Move/Up()` - Drag & Drop Logik
- `checkPiecePlacement()` - Prüft korrekte Platzierung
- `checkVictory()` - Prüft Sieg-Bedingung

## Tipps zum Spielen

1. **Starten Sie mit den Ecken**: Ecken und Ränder sind leichter zu identifizieren
2. **Nutzen Sie die Vorschau**: Blenden Sie die Vorschau ein, um schwierige Teile zu finden
3. **Sortieren Sie nach Farben**: Versuchen Sie, ähnliche Farben zu gruppieren
4. **Beginnen Sie mit weniger Teilen**: Üben Sie zuerst mit 10x10, bevor Sie größere Puzzles versuchen

## Lizenz

Dieses Projekt ist Open Source und frei verwendbar.

## Autor

Erstellt mit Claude AI

## Verbesserungsvorschläge

Mögliche zukünftige Features:
- Speichern/Laden von Puzzle-Fortschritt
- Bestenliste für verschiedene Puzzle-Größen
- Verschiedene Puzzle-Formen (nicht nur rechteckig)
- Mehrspielermodus
- Schwierigkeitsgrade mit unterschiedlichen Einrast-Schwellenwerten
- Zoom-Funktion für große Puzzles
- Puzzle-Rotation (gedrehte Teile)

Viel Spaß beim Puzzeln! 🎉
