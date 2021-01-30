import { syncDown, syncUp } from './index';

describe('Poxlsx', () => {
  it('should define sync down/sync up functions', () => {
    expect(syncDown).toBeDefined();
    expect(syncUp).toBeDefined();
  });
});
