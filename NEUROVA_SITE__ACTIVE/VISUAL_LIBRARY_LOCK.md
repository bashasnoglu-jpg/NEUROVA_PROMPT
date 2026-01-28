# NEUROVA VISUAL LIBRARY LOCK (Source of Truth)

Bu dosya, görsel üretim ve yerleştirme için **tek doğruluk kaynağıdır**.
Dosya isimleri ve prompt kimlikleri burada kilitlenir.

---

## Hammam Card Library — Locked Mapping (v1.0)
- /assets/img/cards/hamam/01.jpg -> hamam_01
- /assets/img/cards/hamam/02.jpg -> hamam_02
- /assets/img/cards/hamam/03.jpg -> hamam_03
- /assets/img/cards/hamam/04.jpg -> hamam_04
- /assets/img/cards/hamam/05.jpg -> hamam_05
- /assets/img/cards/hamam/06.jpg -> hamam_06

## Massage Card Library — Locked Mapping (v1.0)
- /assets/img/cards/masaj/01.jpg -> masaj_01
- /assets/img/cards/masaj/02.jpg -> masaj_02
- /assets/img/cards/masaj/03.jpg -> masaj_03
- /assets/img/cards/masaj/04.jpg -> masaj_04
- /assets/img/cards/masaj/05.jpg -> masaj_05
- /assets/img/cards/masaj/06.jpg -> masaj_06

## Skin Care Card Library — Locked Mapping (v1.0)
- /assets/img/cards/cilt/01.jpg -> cilt_01
- /assets/img/cards/cilt/02.jpg -> cilt_02
- /assets/img/cards/cilt/03.jpg -> cilt_03
- /assets/img/cards/cilt/04.jpg -> cilt_04
- /assets/img/cards/cilt/05.jpg -> cilt_05
- /assets/img/cards/cilt/06.jpg -> cilt_06

## Kids & Family Card Library — Locked Mapping (v1.0)
- /assets/img/cards/kids/01.jpg -> kids_01 (NO CHILD FACES)
- /assets/img/cards/kids/02.jpg -> kids_02 (NO CHILD FACES)
- /assets/img/cards/kids/03.jpg -> kids_03 (NO CHILD FACES)
- /assets/img/cards/kids/04.jpg -> kids_04 (NO CHILD FACES)
- /assets/img/cards/kids/05.jpg -> kids_05 (NO CHILD FACES)
- /assets/img/cards/kids/06.jpg -> kids_06 (NO CHILD FACES)

## Signature Card Library — Locked Mapping (v1.0)
- /assets/img/cards/signature/01.jpg -> signature_01 (Couples Ritual Mood)
- /assets/img/cards/signature/02.jpg -> signature_02 (Prestige Marble & Water)
- /assets/img/cards/signature/03.jpg -> signature_03 (Signature Oil — Unbranded)
- /assets/img/cards/signature/04.jpg -> signature_04 (Four Hands Concept — Abstract)
- /assets/img/cards/signature/05.jpg -> signature_05 (Celebration — Minimal)
- /assets/img/cards/signature/06.jpg -> signature_06 (Night / Deep Calm)

---

## Prompt Library (Gemini) — LOCKED v1.0

### Master Style (use on every card)
Pinterest-style quiet luxury spa card, warm smoky greys, low saturation, soft diffused light, soft film grain, minimal composition, strong negative space, photorealistic, 4:5 portrait, no people, no faces, no text, no logos, no labels.

### Massage 04–06
- masaj_04: Close-up of massage oil droplets on a warm stone surface, subtle lamp glow bokeh in background.
- masaj_05: Bamboo massage sticks neatly placed on a folded off-white linen towel on dark marble.
- masaj_06: Soft cotton robe texture with a single smooth basalt stone on a stone tray, ultra-minimal.

### Skin Care 01–06 (unbranded, clean)
- cilt_01: Unbranded frosted glass jar with condensation on a dark stone tray, single white orchid petal nearby.
- cilt_02: Clean swirl of rich cream on matte slate surface, macro texture.
- cilt_03: Clear water in a minimalist glass bowl, gentle ripples, reflective marble background.
- cilt_04: Unbranded dropper bottle (no label) on wet marble, subtle reflections.
- cilt_05: Folded off-white linen towel with a small wooden skincare spatula, clean counter.
- cilt_06: Abstract light through frosted glass with tiny water droplets, ultra-minimal.

### Kids 01–06 (NO CHILD FACES)
- kids_01: Folded ultra-soft towel stack, clean stone background.
- kids_02: Plush cotton blanket texture macro, cozy and minimal.
- kids_03: Small minimalist wooden toy out of focus beside a soft towel (very subtle).
- kids_04: Gentle bubbles in a small glass bowl, spa-safe and minimal.
- kids_05: Tiny pair of slippers on a clean stone floor, soft light.
- kids_06: Soft neutral textile folds, strong negative space.

### Signature 01–06 (insansız)
- signature_01: Two neatly folded robes on a stone bench (no bodies), soft steam background.
- signature_02: Premium marble and water reflection detail, subtle highlights.
- signature_03: Unbranded ceramic oil vessel (no label) with a single drop on stone tray.
- signature_04: Abstract four-hands concept without hands: four smooth stones arranged symmetrically on linen.
- signature_05: Celebration mood without alcohol: minimal ribbon on linen towel, soft glow.
- signature_06: Night deep calm: dark stone wall with gentle steam and a single dim lamp reflection.

---

# Generation Settings (v1.0)

## Output
- Target size: 1024x1792 (portrait)
- Aspect: 4:5 card framing (Pinterest). If model outputs different ratio, crop/resize to 4:5 after generation.
- Format: JPG (sRGB)
- Compression: high quality (avoid heavy artifacts)

## Visual Style Lock
- Pinterest-style quiet luxury
- Warm smoky greys (warm grey palette), low saturation
- Soft diffused lighting, gentle shadows
- Soft film grain (subtle), minimal composition
- Strong negative space (leave room for UI overlays if needed)
- Clean reflections (no harsh glare)

## Safety / Clean Rules (Hard Lock)
- NO people, NO faces (especially Kids set: absolutely no child faces)
- NO text, NO typography, NO watermarks
- NO logos, NO brand marks, NO labels on bottles
- No medical claims, no explicit body parts, no nudity
- Keep props unbranded and generic