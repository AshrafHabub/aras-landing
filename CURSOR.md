# Aras GmbH — Design System & Landing

Die Aras GmbH (Groß- und Einzelhandel) ist das Dach. Das operative Geschäft liegt bei drei Marken:

| # | Marke | Was | Link |
|---|---|---|---|
| 01 | **Kaufmann GmbH** | Cash & Carry, Großhandel für Geschäftskunden in Dortmund | Standort-Seite (URL fehlt noch) |
| 02 | **DeKaufmann.de** | Online-Shop für das Kaufmann-Sortiment | https://dekaufmann.de |
| 03 | **DeSquishy.de** | Online-Shop für Squishys | https://desquishy.de |

Die Website ist **eine einzige Landing**, mobil zuerst. Sie hat einen Auftritt: Ein goldenes 3D-Squishy (das eigene Modell *Golden Glitter Baozi*) fällt auf die Bühne, lässt sich antippen und fliegt beim Scrollen in die DeSquishy-Karte. Danach stehen die drei Marken als gestapelte Karten da.

**Richtung: dunkle Bühne, ein goldenes Objekt, Schwarz-Weiß drumherum, Rot nur für ARAS.**

---

## 1. Stimme

- Kurz, direkt, selbstbewusst. Sätze mit Punkt, keine Ausrufezeichen.
- Headline-Muster: zwei kurze Sätze. *Drei Marken. Eine Familie.*
- Kein Agentur-Sprech („innovativ“, „ganzheitlich“). Lieber konkret: *Vor Ort einkaufen, direkt mitnehmen.*
- Das Squishy darf verspielt sein (*Tipp das Squishy*, *Drück mal drauf*), der Rest bleibt seriös.
- Labels und Kategorien in Mono, GROSS: `CASH & CARRY`, `ONLINE-SHOP`.

## 2. Farbe

Drei Regeln, die alles tragen:

1. **Die Bühne ist dunkel.** `bg` (#0b0b0c) auf der ganzen Landing. Nur so leuchtet das Gold.
2. **Rot gehört ARAS.** Es kommt genau an diesen Stellen vor: `aras-red` als Fläche am Wortmarken-Quadrat (Header und Footer), im Intro-Balken, am Haupt-CTA (`.pill--red`, nur Desktop sichtbar) und als pulsierender Punkt im Hinweis „Tipp das Squishy“; `aras-red-text` als Punkt hinter „Eine Familie.“ und als Fokus-Ring. Die drei Marken-Karten sind **reines Schwarz-Weiß** (`paper` / `surface`), wie ihre Logos.
3. **Gold kommt nur aus dem 3D-Modell.** `gold-glow` ist kein UI-Ton, sondern nur der Lichtschein hinter dem Squishy. Keine goldenen Buttons, keine goldene Schrift.

Text-Paare (alle ≥ 4,5:1): `ink` auf `bg`/`surface` · `ink-muted` auf `bg`/`surface` · `paper-ink` und `paper-muted` auf `paper` · `on-red` auf `aras-red` · `aras-red-text` auf `bg`.
`ink-faint` ist nur Dekor (4,1:1) und nie Text unter 24px.

Karten wechseln hell/dunkel: 01 Kaufmann **paper**, 02 DeKaufmann.de **surface**, 03 DeSquishy.de **paper** (das Gold wirkt auf Hell am stärksten).

## 3. Typografie

- **Archivo** (variabel, Gewicht 100–900, Breite 62–125 %). Display-Überschriften (`.display`) mit `font-stretch: 125%` und Gewicht 800: breit, laut, plakativ. Fließtext in normaler Breite.
- **JetBrains Mono** für Labels, Zähler, Tags.
- Beide Schriften liegen als WOFF2 im System (`fonts/`, auf Latin + Umlaute reduziert, zusammen ca. 150 KB) und werden **selbst gehostet**. Keine Google-Fonts-Anfrage (DSGVO, LG München I, Az. 3 O 17493/20).
- Display-Größen sind fluide (`clamp()`), siehe die `usage` der Typo-Stile. Die Werte in tokens.json sind die Größe bei 390px Breite.
- Headline-Zeilen werden per Maske „hochgeschoben“ (`overflow: hidden` + `translateY(105%) → 0`).

## 4. Layout

- **Mobile first.** Basis 390 × 844. Breakpoints **720px** (Tablet) und **1080px** (Desktop).
- Seitenrand `space-4` → `space-6` → `space-7`. Header 60px (72px ab Tablet), fix, wird beim Scrollen zu Glas (Blur + `line`-Kante).
- Hero füllt `100svh`: oben Label + Squish-Zähler, Mitte die Squishy-Bühne, unten Headline + Lede. Desktop: Headline links, Squishy rechts.
- Marken: mobil **gestapelte Sticky-Karten** (jede 14px tiefer, die verdeckte schrumpft auf 93 %), Desktop **drei Spalten** mit Hover-Lift.
- Karten: `radius-l` (28px), riesige Outline-Ziffer (01/02) als monochrome Grafik, Tags unten links, Pill unten rechts.

## 5. Bewegung

Alles, was sich bewegt, läuft über `transform` und `opacity`; Layout-Eigenschaften werden nie animiert. Zwei Ausnahmen sind reine Farbübergänge: der Header blendet `background-color` und `border-color` ein (420 ms), Pills wechseln beim Hover `background-color` (180 ms).

| Moment | Was passiert | Dauer |
|---|---|---|
| Intro | `ARAS` steigt Buchstabe für Buchstabe auf, roter Balken wischt, Vorhang fährt nach oben. Nur 1× pro Sitzung und nur, wenn `app.js` läuft (siehe 8). | 1,25 s + 0,7 s |
| Auftritt | Squishy fällt aus 3,2 Einheiten Höhe (Schwerkraft), schlägt auf, quetscht oben ein, federt nach. | ~1 s |
| Antippen | Treffer-Seite wird erkannt (oben/vorne/hinten/links/rechts) → passender Morph per Feder (k 230, d 11) + Gesamt-Stauchung. Zähler `×01`, 8 ms Vibration auf Android. | ~0,8 s |
| Idle | Atmen (press_top 0–5 %), leichtes Pendeln (±0,32 rad), Schweben (±3,5 %). Bei Maus-Bedienung (`pointerType === 'mouse'`, unabhängig von der Bildschirmbreite) neigt es sich zum Zeiger. | Endlos |
| Flug | `pickAnchor()` beobachtet den kleinen Landeplatz `[data-anchor="squishy"]` in der Karte, nicht die ganze Karte: Sobald seine Oberkante über 82 % der Viewport-Höhe steigt und seine Unterkante noch unter 12 % liegt, wird er zum Ziel, sonst der Hero-Anker. Das Squishy folgt dem Ziel gedämpft (Faktor `1 − e^(−9·dt)`), neigt sich bei seitlicher Bewegung und macht bei Ankunft „Plopp“. | ~0,3 s |
| Karten | Sticky-Stapel, verdeckte Karte skaliert auf 0,93. | an Scroll |
| Laufband | Endlos, 26 s pro Runde, `will-change: transform`. | Endlos |

`prefers-reduced-motion`: kein Intro, kein Fall, kein Laufband, kein Atmen/Pendeln/Schweben. Die Federn bleiben gleich steif (k 230), werden aber kritisch gedämpft (d = 2·√k ≈ 30, Stauchung entsprechend), schwingen also nicht nach; der Antipp-Impuls ist kleiner (5 statt 13). Der Ankerwechsel folgt schneller (Faktor 30 statt 9), das Squishy springt also fast direkt an sein Ziel statt sichtbar zu fliegen. CSS-Animationen und -Übergänge werden auf 1 ms gekürzt.

## 6. Das 3D-Squishy

- Quelle: `Golden Glitter Baozi` (7 Materialien: goldene Rückwand, Gel-Hülle, Glitzer, Perlen, Gesicht, Augenglanz, Bäckchen).
- 5 Morph-Targets: `press_top`, `press_front` (Gesichtsseite, +z), `press_back`, `press_left` (−x), `press_right` (+x). Dazu 7 Animationen im File, die die Seite aber nicht braucht (die Feder rechnet live).
- **Optimiert:** 8,77 MiB → **6,51 MiB** (6 827 512 Byte). Was sich geändert hat: Normalen und Morph-Normalen auf 8 Bit, Vertex-Farben auf 8 Bit, UVs auf 16 Bit (normalisiert), doppelte Daten zusammengelegt; maximale Abweichung der Normalen < 0,4 %, der Farben < 0,2 %. Was gleich blieb: Basis-Positionen sind weiter float32. Die fünf Morph-Positionen waren schon in der Originaldatei normalisierte 16-Bit-Werte (`KHR_mesh_quantization`) und wurden 1:1 übernommen, sind also nicht verlustfrei gegenüber Float, aber unverändert gegenüber deinem Export.
- **Übertragungsgröße** (gemessen): gzip -9 2,69 MiB, Brotli q11 1,87 MiB. Der Server sollte Brotli liefern.
- Gel-Hülle: In der Datei 28 % Alpha. Zur Laufzeit wird sie gegen ein `MeshPhysicalMaterial` mit Klarlack getauscht (nasser Glanz), Deckkraft dabei mindestens 0,32 (`Math.max(m.opacity, 0.32)`). Licht: RoomEnvironment + warmes Hauptlicht + **rotes Kantenlicht** (die ARAS-Farbe, die das Gold einfasst).
- Bis das Modell geladen ist, „atmet“ ein CSS-Gold-Blob an seiner Stelle, mit Prozentanzeige, sofern der Server die Dateigröße mitschickt (sonst „Lädt …“). Ohne WebGL bleibt der Blob und reagiert auf Antippen; das braucht JavaScript.

## 7. Performance-Budget

- **Ein** WebGL-Canvas für die ganze Seite (`position: fixed`, `pointer-events: none`), folgt DOM-Ankern (`[data-anchor="hero"]`, `[data-anchor="squishy"]`).
- Pixel-Ratio gedeckelt auf 1,75; fallen die Frames unter ~42 fps, sinkt sie automatisch in 0,25er-Schritten bis 1.
- Gerendert wird nur, wenn das Squishy im Bild ist. Tab im Hintergrund → rAF pausiert.
- Antippen: erst Kugel-Test, dann Raycast. Scroll-Listener gibt es nicht, alles läuft in einem rAF.
- Modell wird per `<link rel="preload">` parallel zum Intro geladen.
- Zielwerte (noch **nicht gemessen**, bitte nach dem Deploy mit Lighthouse prüfen): LCP < 2,5 s, CLS nahe 0, 60 fps auf einem Mittelklasse-Handy. Das Intro verzögert die Headline um ca. 1,3 s; geprüft habe ich nur Darstellung und Funktion, nicht die Bildrate auf echter Hardware.
- **Server:** `.glb` mit Brotli/gzip ausliefern (`model/gltf-binary`), `Cache-Control: public, max-age=31536000, immutable` für `assets/`.

## 8. Barrierefreiheit

- Fokus-Ring: 2px `aras-red-text`, 3px Abstand.
- Canvas und Intro sind `aria-hidden`; der Zähler ist `aria-live="polite"`.
- Alle Links sind echte `<a>`, Externe mit `rel="noopener"`.
- **Ohne JavaScript:** Ein Inline-Skript im `<head>` setzt `html.js`; nur unter `.js` sind Intro, Headline-Versatz und `.reveal` aktiv. Ohne JS fehlt die Klasse: kein Intro, Headline und alle Texte sofort sichtbar, statischer (atmender) Gold-Blob statt 3D, Lade-Hinweis, Tipp-Hinweis und Zähler ausgeblendet. Nicht antippbar.
- **app.js lädt nicht** (z. B. three.js-CDN nicht erreichbar): `app.js` setzt beim Start `html.app-ready`. Fehlt die Klasse nach 3 s, entfernt das Inline-Skript `.js` wieder und die Seite zeigt dieselbe statische Fassung. Startet `app.js` später doch noch, bleibt es bei der statischen Fassung ohne Intro, nur das 3D-Squishy, die Hinweise und der Zähler kommen dazu. Bei sehr langsamer Verbindung sieht man bis zu 3 s den Intro-Vorhang.

## 9. Logos

**Noch nicht im System.** Bis die echten Dateien kommen, gibt es Platzhalter aus Schrift:
- ARAS: `ARAS` in Archivo Expanded 800 + rotes Quadrat (`aras-red`). Wird durch das echte ARAS-Logo (mit roten Akzenten) ersetzt.
- Marken: Name in Archivo Expanded 800, Schwarz auf `paper` bzw. Weiß auf `surface`. Werden durch die echten Schwarz-Weiß-Logos ersetzt.

Logos als SVG in eine Asset-Gruppe **Logos** legen. Einfarbige Logos in `paper-ink` bzw. `ink` einfärben.

## 10. Übergabe an Cursor

Das ZIP `aras-landing-cursor.zip` enthält:

```
index.html            Markup der Landing; Platzhalter-Texte sind mit <!-- PLATZHALTER-TEXT --> markiert
styles.css            komplettes CSS, Tokens als CSS-Variablen
app.js                Intro, 3D-Bühne, Squish-Physik, Kartenstapel
tokens.json           alle Tokens als Daten (Farben, Typo, Abstände, Radien, Dauer, Easing, z-Index)
CURSOR.md             dieses Dokument
assets/squishy.glb    optimiertes Modell
assets/fonts/*.woff2  Archivo + JetBrains Mono
```

Schritte:

1. **Cursor öffnen**: https://cursor.com/download — neuen Ordner anlegen, ZIP-Inhalt hineinkopieren.
2. **Lokal testen**: im Ordner `npx serve .` (https://www.npmjs.com/package/serve) oder die VS-Code-Erweiterung *Live Server* (https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer). Direkt per Doppelklick geht nicht (Module + GLB brauchen http).
3. **Prompt in Cursor einfügen** (Chat → Agent):

> Das ist die fertige Designvorlage der Aras-GmbH-Landing (index.html, styles.css, app.js, tokens.json; Beschreibung in CURSOR.md). Baue sie 1:1 als Next.js-App (App Router, TypeScript) nach. Regeln: Design, Abstände, Farben, Schriften und Animationen exakt übernehmen. three.js als npm-Paket (Version 0.170.0) statt importmap, die 3D-Logik aus app.js in einen Client-Component `SquishyStage` mit useEffect und sauberem Dispose. Schriften über next/font/local aus assets/fonts. Das GLB in /public/assets. Keine Layout-Animationen; Bewegung über transform/opacity, Farbübergänge (Header, Pill-Hover) wie im Original. Das JS-Gate beibehalten: Ohne JavaScript müssen Headline und alle Texte sofort sichtbar sein und es darf kein Intro-Vorhang stehen bleiben (bei SSR die versteckten Anfangszustände nur per Klasse setzen, die erst auf dem Client gesetzt wird). Platzhalter-Texte sind mit `<!-- PLATZHALTER-TEXT -->` markiert. Mobile first. Lighthouse Performance ≥ 90 mobil. Ergänze Impressum- und Datenschutz-Seite im selben Stil (Theme „light“ aus tokens.json).

4. **Links eintragen**: Kaufmann-Standort (`href="#kaufmann"`), Impressum, Datenschutz, Kontakt.
5. **Deploy**, z. B. Vercel (https://vercel.com/new) oder dein eigener Server; dort Brotli für `.glb` aktivieren.

Docs bei Bedarf: three.js GLTFLoader https://threejs.org/docs/#examples/en/loaders/GLTFLoader · Morph-Targets https://threejs.org/docs/#api/en/objects/Mesh.morphTargetInfluences · Modell weiter komprimieren (Meshopt): https://gltf-transform.dev/cli

## 11. Offen

- Echte Logos (ARAS, Kaufmann, DeKaufmann.de, DeSquishy.de).
- URL/Adresse Kaufmann-Standort, Öffnungszeiten.
- Impressum- und Datenschutz-Texte.
- Texte auf den Karten sind Vorschläge: bitte prüfen.
- Optional: Modell mit Meshopt weiter verkleinern (Ersparnis nicht getestet; braucht dann den MeshoptDecoder im Loader).
