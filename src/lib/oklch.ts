/**
 * Minimal sRGB ↔ OKLab conversion for perceptually uniform colour
 * interpolation, so phase morphs pass through believable in-between
 * colours instead of the grey valley sRGB mixing produces.
 * Constants from Björn Ottosson's OKLab reference implementation
 * (public domain). No dependencies.
 */

interface Lab {
  L: number
  a: number
  b: number
}

function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

function linearToSrgb(c: number): number {
  return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055
}

function hexToOklab(hex: string): Lab {
  const n = parseInt(hex.slice(1), 16)
  const r = srgbToLinear(((n >> 16) & 255) / 255)
  const g = srgbToLinear(((n >> 8) & 255) / 255)
  const b = srgbToLinear((n & 255) / 255)
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  return {
    L: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    a: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    b: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  }
}

function oklabToHex(lab: Lab): string {
  const l = (lab.L + 0.3963377774 * lab.a + 0.2158037573 * lab.b) ** 3
  const m = (lab.L - 0.1055613458 * lab.a - 0.0638541728 * lab.b) ** 3
  const s = (lab.L - 0.0894841775 * lab.a - 1.291485548 * lab.b) ** 3
  const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
  const b = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s
  const channel = (c: number) => {
    const v = Math.round(255 * Math.min(1, Math.max(0, linearToSrgb(c))))
    return v.toString(16).padStart(2, '0')
  }
  return `#${channel(r)}${channel(g)}${channel(b)}`
}

/**
 * Mix two hex colours in OKLCH at t ∈ [0, 1]; hue takes the shorter arc.
 */
export function mixOklch(hexA: string, hexB: string, t: number): string {
  const A = hexToOklab(hexA)
  const B = hexToOklab(hexB)
  const cA = Math.hypot(A.a, A.b)
  const cB = Math.hypot(B.a, B.b)
  const hA = Math.atan2(A.b, A.a)
  const hB = Math.atan2(B.b, B.a)
  let dh = hB - hA
  if (dh > Math.PI) dh -= 2 * Math.PI
  if (dh < -Math.PI) dh += 2 * Math.PI
  const L = A.L + (B.L - A.L) * t
  const C = cA + (cB - cA) * t
  const h = hA + dh * t
  return oklabToHex({ L, a: C * Math.cos(h), b: C * Math.sin(h) })
}
