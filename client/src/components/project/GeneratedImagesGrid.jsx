function GeneratedImagesGrid({ images = [], selectedImage, onSelect, tone = 'dark' }) {
  const isWarm = tone === 'warm';

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {images.map((image) => (
        <button
          type="button"
          key={image}
          onMouseEnter={() => onSelect(image)}
          onFocus={() => onSelect(image)}
          onClick={() => onSelect(image)}
          className={`overflow-hidden rounded-xl border transition ${
            selectedImage === image
              ? isWarm
                ? 'border-wood-500'
                : 'border-brand-300'
              : isWarm
                ? 'border-sand-300'
                : 'border-white/10'
          }`}
        >
          <img src={image} alt="Generated render option" className="h-28 w-full object-cover" />
        </button>
      ))}
    </div>
  );
}

export default GeneratedImagesGrid;

