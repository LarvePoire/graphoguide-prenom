import { useEffect, useRef, useState } from 'react'

/* ============================================================================
 * Données & rendu — porté depuis graphoguide-prenom.html
 *
 * Chaque lettre = liste de FLÈCHES (traits dirigés), dans l'ordre d'écriture.
 * Repère : x:0..w , y:0(haut)..100(base). curve:1 => trait courbe. mark:1 => accent.
 * ========================================================================== */

type Stroke = { pts: number[][]; curve?: number; mark?: number }
type GlyphData = { w: number; s: Stroke[] }
type Glyph = { w: number; strokes: Stroke[]; dots: number[][] }
type Trait = 'solid' | 'dash'
type DrawState = { name: string; trait: Trait; guides: boolean; rows: number }

const G: Record<string, GlyphData> = {
  A: { w: 60, s: [{ pts: [[30, 0], [2, 100]] }, { pts: [[30, 0], [58, 100]] }, { pts: [[12, 62], [48, 62]] }] },
  B: { w: 56, s: [{ pts: [[0, 3], [0, 99]] }, { pts: [[0, 3], [30, 6], [44, 16], [44, 34], [30, 48], [0, 50]], curve: 1 }, { pts: [[0, 50], [34, 52], [50, 64], [50, 84], [34, 97], [0, 99]], curve: 1 }] },
  C: { w: 84, s: [{ pts: [[78, 20], [48, 2], [18, 16], [4, 50], [18, 84], [48, 98], [78, 80]], curve: 1 }] },
  D: { w: 60, s: [{ pts: [[0, 3], [0, 99]] }, { pts: [[0, 3], [34, 8], [56, 28], [60, 50], [56, 72], [34, 94], [0, 99]], curve: 1 }] },
  E: { w: 52, s: [{ pts: [[0, 0], [0, 100]] }, { pts: [[0, 0], [50, 0]] }, { pts: [[0, 50], [44, 50]] }, { pts: [[0, 100], [50, 100]] }] },
  F: { w: 52, s: [{ pts: [[0, 0], [0, 100]] }, { pts: [[0, 0], [50, 0]] }, { pts: [[0, 50], [44, 50]] }] },
  G: { w: 86, s: [{ pts: [[78, 20], [48, 2], [18, 16], [4, 50], [18, 84], [48, 98], [80, 82], [80, 54], [56, 54]], curve: 1 }] },
  H: { w: 58, s: [{ pts: [[0, 0], [0, 100]] }, { pts: [[58, 0], [58, 100]] }, { pts: [[0, 50], [58, 50]] }] },
  I: { w: 36, s: [{ pts: [[18, 0], [18, 100]] }, { pts: [[2, 0], [34, 0]] }, { pts: [[2, 100], [34, 100]] }] },
  J: { w: 42, s: [{ pts: [[34, 4], [34, 64], [31, 82], [20, 93], [9, 88], [6, 76]], curve: 1 }] },
  K: { w: 56, s: [{ pts: [[0, 0], [0, 100]] }, { pts: [[52, 2], [10, 48]] }, { pts: [[10, 48], [54, 98]] }] },
  L: { w: 48, s: [{ pts: [[0, 0], [0, 100]] }, { pts: [[0, 100], [46, 100]] }] },
  M: { w: 72, s: [{ pts: [[0, 0], [0, 100]] }, { pts: [[0, 0], [36, 55]] }, { pts: [[36, 55], [72, 0]] }, { pts: [[72, 0], [72, 100]] }] },
  N: { w: 58, s: [{ pts: [[0, 0], [0, 100]] }, { pts: [[0, 0], [58, 100]] }, { pts: [[58, 0], [58, 100]] }] },
  O: { w: 88, s: [{ pts: [[44, 2], [16, 14], [2, 50], [16, 86], [44, 98], [72, 86], [86, 50], [72, 14], [44, 2]], curve: 1 }] },
  P: { w: 54, s: [{ pts: [[0, 3], [0, 99]] }, { pts: [[0, 3], [32, 6], [48, 18], [48, 38], [32, 50], [0, 52]], curve: 1 }] },
  Q: { w: 90, s: [{ pts: [[45, 2], [16, 14], [2, 50], [16, 86], [45, 98], [74, 86], [88, 50], [74, 14], [45, 2]], curve: 1 }, { pts: [[60, 74], [88, 102]] }] },
  R: { w: 56, s: [{ pts: [[0, 3], [0, 99]] }, { pts: [[0, 3], [32, 6], [46, 18], [46, 36], [32, 48], [0, 50]], curve: 1 }, { pts: [[20, 50], [54, 99]] }] },
  S: { w: 72, s: [{ pts: [[62, 18], [38, 4], [16, 18], [20, 38], [40, 50], [56, 62], [54, 82], [32, 96], [8, 82]], curve: 1 }] },
  T: { w: 56, s: [{ pts: [[28, 0], [28, 100]] }, { pts: [[0, 0], [56, 0]] }] },
  U: { w: 80, s: [{ pts: [[6, 2], [6, 60], [18, 90], [40, 98], [62, 90], [74, 60], [74, 2]], curve: 1 }] },
  V: { w: 60, s: [{ pts: [[0, 0], [30, 100]] }, { pts: [[30, 100], [60, 0]] }] },
  W: { w: 84, s: [{ pts: [[0, 0], [16, 100]] }, { pts: [[16, 100], [42, 25]] }, { pts: [[42, 25], [68, 100]] }, { pts: [[68, 100], [84, 0]] }] },
  X: { w: 56, s: [{ pts: [[0, 0], [56, 100]] }, { pts: [[56, 0], [0, 100]] }] },
  Y: { w: 56, s: [{ pts: [[0, 0], [28, 52]] }, { pts: [[56, 0], [28, 52]] }, { pts: [[28, 52], [28, 100]] }] },
  Z: { w: 56, s: [{ pts: [[0, 0], [56, 0]] }, { pts: [[56, 0], [0, 100]] }, { pts: [[0, 100], [56, 100]] }] },
  ' ': { w: 30, s: [] },
}

const ACC: Record<string, string> = { 'É': 'E', 'È': 'E', 'Ê': 'E', 'Ë': 'E', 'À': 'A', 'Â': 'A', 'Ä': 'A', 'Á': 'A', 'Î': 'I', 'Ï': 'I', 'Í': 'I', 'Ì': 'I', 'Ô': 'O', 'Ö': 'O', 'Ó': 'O', 'Ò': 'O', 'Ù': 'U', 'Û': 'U', 'Ü': 'U', 'Ú': 'U', 'Ç': 'C', 'Ñ': 'N' }
const ACCT: Record<string, string> = { 'É': 'acute', 'È': 'grave', 'Ê': 'circ', 'Ë': 'trema', 'À': 'grave', 'Â': 'circ', 'Ä': 'trema', 'Á': 'acute', 'Î': 'circ', 'Ï': 'trema', 'Í': 'acute', 'Ì': 'grave', 'Ô': 'circ', 'Ö': 'trema', 'Ó': 'acute', 'Ò': 'grave', 'Ù': 'grave', 'Û': 'circ', 'Ü': 'trema', 'Ú': 'acute', 'Ç': 'cedille', 'Ñ': 'tilde' }

function accentMark(type: string, w: number): { s: Stroke[]; d: number[][] } {
  const cx = w / 2
  if (type === 'acute') return { s: [{ pts: [[cx - 6, -8], [cx + 9, -28]], mark: 1 }], d: [] }
  if (type === 'grave') return { s: [{ pts: [[cx - 9, -28], [cx + 6, -8]], mark: 1 }], d: [] }
  if (type === 'circ') return { s: [{ pts: [[cx - 13, -8], [cx, -29], [cx + 13, -8]], mark: 1 }], d: [] }
  if (type === 'tilde') return { s: [{ pts: [[cx - 14, -14], [cx - 4, -23], [cx + 4, -12], [cx + 14, -21]], curve: 1, mark: 1 }], d: [] }
  if (type === 'trema') return { s: [], d: [[cx - 9, -19], [cx + 9, -19]] }
  if (type === 'cedille') return { s: [{ pts: [[cx - 2, 100], [cx + 5, 113], [cx - 9, 124]], curve: 1, mark: 1 }], d: [] }
  return { s: [], d: [] }
}

function getGlyph(ch: string): Glyph | null {
  const direct = G[ch]
  if (direct) return { w: direct.w, strokes: direct.s, dots: [] }
  const base = ACC[ch] ? G[ACC[ch]] : undefined
  if (base) {
    const a = accentMark(ACCT[ch], base.w)
    return { w: base.w, strokes: base.s.concat(a.s), dots: a.d }
  }
  return null
}

/* ===================== rendu ===================== */
const PALETTE = ['#ff5fa6', '#2aa3e6', '#22b573', '#f5a623', '#7a5cf0', '#ff7a3d']
const SCALE = 2,
  W = 1000,
  MARGIN = 50,
  HEADER = 130,
  ROW_H = 252,
  CAP_TOP = 56,
  CAP_H = 160,
  LEGEND_H = 104

function sampleCurve(p: number[][]): number[][] {
  const out: number[][] = [p[0].slice()]
  const quad = (s: number[], c: number[], e: number[]) => {
    for (let t = 1; t <= 12; t++) {
      const u = t / 12,
        iu = 1 - u
      out.push([iu * iu * s[0] + 2 * iu * u * c[0] + u * u * e[0], iu * iu * s[1] + 2 * iu * u * c[1] + u * u * e[1]])
    }
  }
  for (let i = 1; i < p.length - 1; i++) {
    const c = p[i],
      e = [(p[i][0] + p[i + 1][0]) / 2, (p[i][1] + p[i + 1][1]) / 2]
    quad(out[out.length - 1], c, e)
  }
  const s = out[out.length - 1],
    f = p[p.length - 1]
  for (let t = 1; t <= 12; t++) {
    const u = t / 12
    out.push([s[0] + (f[0] - s[0]) * u, s[1] + (f[1] - s[1]) * u])
  }
  return out
}

function ptsAlong(poly: number[][], gap: number): number[][] {
  const cum = [0]
  for (let i = 1; i < poly.length; i++) cum.push(cum[i - 1] + Math.hypot(poly[i][0] - poly[i - 1][0], poly[i][1] - poly[i - 1][1]))
  const L = cum[cum.length - 1],
    res: number[][] = []
  let seg = 1
  for (let d = gap * 0.5; d <= L + 0.01; d += gap) {
    while (seg < poly.length - 1 && cum[seg] < d) seg++
    const a = cum[seg - 1],
      b = cum[seg],
      u = b > a ? (d - a) / (b - a) : 0
    res.push([poly[seg - 1][0] + (poly[seg][0] - poly[seg - 1][0]) * u, poly[seg - 1][1] + (poly[seg][1] - poly[seg - 1][1]) * u])
  }
  return res
}

function strokePoly(ctx: CanvasRenderingContext2D, p: number[][]) {
  ctx.beginPath()
  ctx.moveTo(p[0][0], p[0][1])
  for (let i = 1; i < p.length; i++) ctx.lineTo(p[i][0], p[i][1])
  ctx.stroke()
}

function dot(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fill()
}

function arrowHead(ctx: CanvasRenderingContext2D, x: number, y: number, ang: number, sz: number, c: string) {
  ctx.save()
  ctx.setLineDash([])
  ctx.fillStyle = c
  ctx.lineJoin = 'round'
  ctx.translate(x, y)
  ctx.rotate(ang)
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(-sz, -sz * 0.5)
  ctx.lineTo(-sz, sz * 0.5)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

function trimPoly(poly: number[][], dStart: number, dEnd: number): number[][] {
  const cum = [0]
  for (let i = 1; i < poly.length; i++) cum.push(cum[i - 1] + Math.hypot(poly[i][0] - poly[i - 1][0], poly[i][1] - poly[i - 1][1]))
  const L = cum[cum.length - 1]
  if (dStart + dEnd > L * 0.7) {
    dStart = L * 0.35
    dEnd = L * 0.35
  }
  const t0 = dStart,
    t1 = L - dEnd
  const at = (t: number): number[] => {
    let i = 1
    while (i < poly.length - 1 && cum[i] < t) i++
    const a = cum[i - 1],
      b = cum[i],
      u = b > a ? (t - a) / (b - a) : 0
    return [poly[i - 1][0] + (poly[i][0] - poly[i - 1][0]) * u, poly[i - 1][1] + (poly[i][1] - poly[i - 1][1]) * u]
  }
  const res: number[][] = [at(t0)]
  for (let i = 0; i < poly.length; i++) if (cum[i] > t0 && cum[i] < t1) res.push(poly[i])
  res.push(at(t1))
  return res
}

function line(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
}

function renderLegend(ctx: CanvasRenderingContext2D, n: number, yTop: number) {
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#34302a'
  ctx.font = '600 24px Fredoka, sans-serif'
  ctx.fillText('Dans quel ordre tracer :', W / 2, yTop + 24)
  const cD = 30,
    pad = 9,
    gapItem = 30,
    yc = yTop + 64
  ctx.font = '600 22px Fredoka, sans-serif'
  ctx.textAlign = 'left'
  const items: { i: number; lab: string; w: number }[] = []
  let total = 0
  for (let i = 1; i <= n; i++) {
    const lab = (i === 1 ? '1er' : i + 'e') + ' trait'
    const tw = ctx.measureText(lab).width
    const w = cD + pad + tw
    items.push({ i, lab, w })
    total += w
  }
  total += gapItem * Math.max(0, n - 1)
  let x = (W - total) / 2
  items.forEach((it) => {
    const c = PALETTE[(it.i - 1) % PALETTE.length],
      cx = x + cD / 2
    ctx.fillStyle = c
    ctx.beginPath()
    ctx.arc(cx, yc, cD / 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#fff'
    ctx.font = '700 17px "Baloo 2", sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(String(it.i), cx, yc + 0.5)
    ctx.fillStyle = '#34302a'
    ctx.font = '600 22px Fredoka, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(it.lab, x + cD + pad, yc)
    x += it.w + gapItem
  })
}

function draw(canvas: HTMLCanvasElement, state: DrawState) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const display = state.name.trim() || ' '
  const chars = [...display.toLocaleUpperCase('fr-FR')]
  const rows = state.rows
  const height = HEADER + rows * ROW_H + LEGEND_H + 20
  canvas.width = W * SCALE
  canvas.height = height * SCALE
  ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0)

  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, W, height)
  ctx.fillStyle = '#fff7df'
  ctx.fillRect(0, 0, W, HEADER)
  ctx.strokeStyle = '#34302a'
  ctx.lineWidth = 3
  ctx.setLineDash([])
  ctx.strokeRect(1.5, 1.5, W - 3, height - 3)
  line(ctx, 0, HEADER, W, HEADER)
  ctx.fillStyle = '#34302a'
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'left'
  ctx.font = '600 30px Fredoka, sans-serif'
  ctx.fillText("Je m'entraîne à écrire :", MARGIN, HEADER / 2 - 16)
  ctx.font = '700 46px "Baloo 2", sans-serif'
  ctx.fillStyle = PALETTE[0]
  ctx.fillText(display, MARGIN, HEADER / 2 + 24)
  ctx.font = '40px "Baloo 2"'
  ctx.textAlign = 'right'
  ctx.fillStyle = '#34302a'
  ctx.fillText('➜', W - MARGIN, HEADER / 2)

  // échelle : on remplit la hauteur de capitale, puis on réduit si trop large
  const glyphs: Glyph[] = chars.map((c) => getGlyph(c) ?? { w: 30, strokes: [], dots: [] })
  const CELL = 100,
    SPC = 14 // chaque lettre tient dans un carré identique (CELL x 100), centrée
  const advU = glyphs.length * CELL + SPC * Math.max(0, glyphs.length - 1)
  const maxW = W - 2 * MARGIN
  const s = Math.min(CAP_H / 100, maxW / advU)
  const totalW = advU * s,
    startX = (W - totalW) / 2
  const maxN = Math.max(1, ...glyphs.map((g) => g.strokes.filter((st) => !st.mark).length))

  const aLw = Math.max(2.5, s * 3.3),
    headSz = Math.max(7, s * 8.5),
    dotR = Math.max(1.4, s * 1.9),
    dotGap = s * 7
  const gapTrim = Math.max(4, s * 6.5)

  for (let r = 0; r < rows; r++) {
    const top = HEADER + r * ROW_H,
      capTop = top + CAP_TOP,
      baseY = capTop + CAP_H,
      midY = capTop + CAP_H / 2
    if (state.guides) {
      ctx.strokeStyle = '#e0d6bf'
      ctx.setLineDash([])
      ctx.lineWidth = 2
      line(ctx, MARGIN, capTop, W - MARGIN, capTop)
      ctx.lineWidth = 2.5
      line(ctx, MARGIN, baseY, W - MARGIN, baseY)
      ctx.lineWidth = 1.6
      ctx.setLineDash([6, 9])
      line(ctx, MARGIN, midY, W - MARGIN, midY)
      ctx.setLineDash([])
    }
    let penX = startX
    glyphs.forEach((g) => {
      const ox = penX + (CELL - g.w) * 0.5 * s
      const map = (p: number[]): number[] => [ox + p[0] * s, capTop + p[1] * s]
      let num = 0
      g.strokes.forEach((st) => {
        const sp = st.pts.map(map)
        const full = st.curve ? sampleCurve(sp) : sp
        // couleur selon l'ordre de la flèche (1=rose, 2=bleu, ...)
        let clr: string
        if (st.mark) {
          clr = PALETTE[0]
        } else {
          num++
          clr = PALETTE[(num - 1) % PALETTE.length]
        }
        const hSz = st.mark ? headSz * 0.7 : headSz,
          lw = st.mark ? aLw * 0.7 : aLw
        const headPoly = st.mark ? full : trimPoly(full, gapTrim, gapTrim)
        const shaftPoly = st.mark ? full : trimPoly(full, gapTrim, gapTrim + hSz * 0.9) // s'arrête avant la pointe
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.setLineDash([])
        ctx.strokeStyle = clr
        ctx.lineWidth = lw
        if (state.trait === 'dash' && !st.mark) {
          ctx.fillStyle = clr
          ptsAlong(shaftPoly, dotGap).forEach((q) => dot(ctx, q[0], q[1], dotR))
        } else {
          strokePoly(ctx, shaftPoly)
        }
        const a = headPoly[headPoly.length - 1],
          b = headPoly[headPoly.length - 2]
        arrowHead(ctx, a[0], a[1], Math.atan2(a[1] - b[1], a[0] - b[0]), hSz, clr)
      })
      // trémas
      g.dots.forEach((d) => {
        const [dx, dy] = map(d)
        ctx.fillStyle = PALETTE[0]
        dot(ctx, dx, dy, Math.max(2.5, s * 3.2))
      })
      penX += (CELL + SPC) * s
    })
  }
  renderLegend(ctx, maxN, HEADER + rows * ROW_H + 6)
}

/* ===================== composant ===================== */
export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [name, setName] = useState('Léa')
  const [trait, setTrait] = useState<Trait>('solid')
  const [guides, setGuides] = useState(true)

  // Redessine à chaque changement de contrôle.
  useEffect(() => {
    if (canvasRef.current) draw(canvasRef.current, { name, trait, guides, rows: 1 })
  }, [name, trait, guides])

  // Premier rendu une fois les polices chargées (évite un tracé avec la police de repli).
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        await document.fonts.load('700 30px Fredoka')
        await document.fonts.load('700 30px "Baloo 2"')
        await document.fonts.ready
      } catch {
        /* polices indisponibles : on dessine quand même */
      }
      if (!cancelled && canvasRef.current) draw(canvasRef.current, { name, trait, guides, rows: 1 })
    })()
    return () => {
      cancelled = true
    }
  }, [])

  function handleDownload() {
    const canvas = canvasRef.current
    if (!canvas) return
    const safe = (name.trim() || 'prenom')
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-zA-Z0-9]/g, '-')
      .toLowerCase()
    const a = document.createElement('a')
    a.download = `${safe}-fleches.png`
    a.href = canvas.toDataURL('image/png')
    a.click()
  }

  return (
    <div className="wrap">
      <header className="hero">
        <span className="badge">➜ lettres-flèches</span>
        <h1>
          Mon <span className="pop">prénom</span> à <span className="pop2">tracer</span>
        </h1>
        <p className="sub">
          Chaque lettre est faite de flèches colorées : on suit l'ordre des couleurs pour tracer la
          lettre dans le bon sens (voir la légende).
        </p>
      </header>
      <div className="panel">
        <div className="controls">
          <div className="field">
            <label htmlFor="name">Le prénom</label>
            <input
              type="text"
              id="name"
              value={name}
              maxLength={10}
              autoComplete="off"
              spellCheck={false}
              onChange={(e) => setName(e.target.value)}
            />
            <div className="hint">Jusqu'à 10 lettres. Accents gérés. Lettres en CAPITALES.</div>
          </div>
          <div className="field">
            <label>Style des flèches</label>
            <div className="seg">
              <button type="button" className={trait === 'solid' ? 'on' : ''} onClick={() => setTrait('solid')}>
                Trait plein
              </button>
              <button type="button" className={trait === 'dash' ? 'on' : ''} onClick={() => setTrait('dash')}>
                Pointillés
              </button>
            </div>
          </div>
          <div className="field" style={{ marginBottom: 22 }}>
            <label>Lignes de cahier</label>
            <div className="seg">
              <button type="button" className={guides ? 'on' : ''} onClick={() => setGuides(true)}>
                Oui
              </button>
              <button type="button" className={!guides ? 'on' : ''} onClick={() => setGuides(false)}>
                Non
              </button>
            </div>
          </div>
          <button type="button" className="dlbtn" onClick={handleDownload}>
            ⬇️ Télécharger l'image
          </button>
        </div>
        <div className="stage">
          <canvas ref={canvasRef} />
          <div className="cap">La légende (couleur ↔ ordre) est incluse dans l'image téléchargée.</div>
        </div>
      </div>
    </div>
  )
}
