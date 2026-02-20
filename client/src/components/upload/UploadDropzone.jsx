import { useRef, useState } from 'react';
import Button from '../ui/Button';
import { validateBlueprintFile } from '../../lib/validators';

function UploadDropzone({ onUpload, isUploading = false, tone = 'dark' }) {
  const inputRef = useRef(null);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const isWarm = tone === 'warm';

  const handleFile = async (file) => {
    const validationError = validateBlueprintFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    await onUpload(file);
  };

  return (
    <div>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          const [file] = event.dataTransfer.files;
          if (file) {
            handleFile(file);
          }
        }}
        className={`rounded-2xl border border-dashed p-6 text-center transition ${
          isWarm
            ? isDragging
              ? 'border-wood-400 bg-wood-200/30'
              : 'border-sand-300 bg-white/65'
            : isDragging
              ? 'border-brand-300 bg-brand-500/10'
              : 'border-white/20 bg-white/[0.02]'
        }`}
      >
        <p className={`text-sm ${isWarm ? 'text-sand-800' : 'text-neutral-300'}`}>
          Drag and drop a blueprint (PNG/JPG/PDF)
        </p>
        <p className={`mt-1 text-xs ${isWarm ? 'text-sand-600' : 'text-neutral-500'}`}>Max 15MB</p>
        <Button
          className="mt-4"
          variant="secondary"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : 'Choose file'}
        </Button>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept="image/png,image/jpeg,application/pdf"
          onChange={(event) => {
            const [file] = event.target.files;
            if (file) {
              handleFile(file);
            }
          }}
        />
      </div>
      {error ? (
        <p className={`mt-2 text-sm ${isWarm ? 'text-red-700' : 'text-red-300'}`}>{error}</p>
      ) : null}
    </div>
  );
}

export default UploadDropzone;

