export const MAX_FILES_PER_BATCH = 10;
export const PER_FILE_LIMIT_BYTES = 4 * 1024 * 1024; // 4 MB
export const TOTAL_BATCH_LIMIT_BYTES = 6 * 1024 * 1024; // 6 MB

export const humanFileSize = (bytes) => {
  if (!Number.isFinite(bytes) || bytes < 0) return '0 B';
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  const value = bytes / Math.pow(1024, exponent);
  return `${value.toFixed(value >= 100 ? 0 : value >= 10 ? 1 : 2)} ${units[exponent]}`;
};
