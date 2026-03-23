import { FileFormatDetector } from './file-format-detector';

describe('FileFormatDetector', () => {
  const detector = new FileFormatDetector();

  it('detects docx by extension with priority', () => {
    const file = new File(['x'], 'demo.docx', {
      type: 'application/octet-stream'
    });

    const result = detector.detect(file);

    expect(result.format).toBe('docx');
    expect(result.detectedBy).toBe('extension');
  });

  it('adds warning for legacy formats', () => {
    const file = new File(['x'], 'legacy.doc', { type: 'application/msword' });

    const result = detector.detect(file);

    expect(result.bestEffort).toBeTrue();
    expect(result.warnings.some((w) => w.code === 'LEGACY_BEST_EFFORT')).toBeTrue();
  });
});
