import { FileAdapterRegistry } from '../registry/file-adapter.registry';
import { CompatParserService } from './compat-parser.service';

describe('CompatParserService', () => {
  it('parses CSV files and returns normalized document', async () => {
    const service = new CompatParserService(new FileAdapterRegistry());
    const file = new File(['col1,col2\nA,B'], 'table.csv', { type: 'text/csv' });

    const normalized = await service.parseFile(file);

    expect(normalized.format).toBe('csv');
    expect(normalized.tables?.[0].rows.length).toBe(2);
    expect(normalized.tables?.[0].rows[1][0]).toBe('A');
  });
});
