import { ACCEPTED_FILE_TYPES, MAX_UPLOAD_SIZE_MB } from './constants';

export function validateBlueprintFile(file) {
  if (!file) {
    return 'Please select a file.';
  }

  if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
    return 'Only PNG, JPG, or PDF files are allowed.';
  }

  const sizeLimit = MAX_UPLOAD_SIZE_MB * 1024 * 1024;
  if (file.size > sizeLimit) {
    return `File exceeds ${MAX_UPLOAD_SIZE_MB}MB size limit.`;
  }

  return null;
}

