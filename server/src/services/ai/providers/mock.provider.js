const BaseAiProvider = require('./base.provider');

class MockProvider extends BaseAiProvider {
  #build2DSvg(variant) {
    const tone = ['#1d4ed8', '#2563eb', '#1e40af', '#0f172a'][variant % 4];
    return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
  <defs>
    <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
      <path d="M 28 0 L 0 0 0 28" fill="none" stroke="rgba(255,255,255,0.16)" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1280" height="720" fill="${tone}"/>
  <rect width="1280" height="720" fill="url(#grid)"/>
  <g fill="none" stroke="rgba(255,255,255,0.92)" stroke-width="8">
    <rect x="170" y="120" width="940" height="470"/>
    <rect x="210" y="170" width="330" height="180"/>
    <rect x="580" y="170" width="490" height="180"/>
    <rect x="210" y="390" width="480" height="160"/>
    <rect x="730" y="390" width="340" height="160"/>
  </g>
</svg>`;
  }

  #build3DSvg(variant) {
    const wall = ['#ede9fe', '#e9d5ff', '#ddd6fe', '#f5f3ff'][variant % 4];
    const floor = ['#a78bfa', '#8b5cf6', '#7c3aed', '#9333ea'][variant % 4];
    return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
  <rect width="1280" height="470" fill="${wall}"/>
  <rect y="470" width="1280" height="250" fill="${floor}"/>
  <g opacity="0.95">
    <rect x="130" y="205" width="390" height="220" rx="18" fill="#ffffff"/>
    <rect x="550" y="170" width="300" height="255" rx="18" fill="#faf5ff"/>
    <rect x="880" y="130" width="270" height="295" rx="22" fill="#f3e8ff"/>
    <rect x="190" y="255" width="180" height="110" rx="12" fill="#c4b5fd"/>
    <rect x="615" y="235" width="170" height="120" rx="12" fill="#c4b5fd"/>
    <circle cx="1015" cy="295" r="78" fill="#ddd6fe"/>
  </g>
</svg>`;
  }

  #toDataUrl(svg) {
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  // Generates deterministic mock URLs while preserving provider contract.
  async generate({ inputUrl, style, outputType, count }) {
    const images = Array.from({ length: count }, (_, idx) => {
      const variant = idx + style.length;
      const svg =
        outputType === '2D' ? this.#build2DSvg(variant) : this.#build3DSvg(variant);
      return this.#toDataUrl(svg);
    });

    return {
      provider: 'mock',
      inputUrl,
      images,
    };
  }
}

module.exports = MockProvider;

