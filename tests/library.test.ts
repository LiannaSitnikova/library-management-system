import { expect } from 'chai';
import { Library } from '../src/services/Library';

interface TestItem {
  id: string;
  name: string;
}

describe('Library Generic Class Tests', () => {
  let library: Library<TestItem>;

  beforeEach(() => {
    library = new Library<TestItem>();
  });

  it('should add items to library', () => {
    library.add({ id: '1', name: 'Item 1' });
    expect(library.getAll()).to.have.lengthOf(1);
  });

  it('should find item by id', () => {
    library.add({ id: '100', name: 'Find Me' });
    const item = library.findById('100');
    expect(item).to.deep.equal({ id: '100', name: 'Find Me' });
  });

  it('should remove item by id', () => {
    library.add({ id: '1', name: 'Delete Me' });
    library.remove('1');
    expect(library.getAll()).to.have.lengthOf(0);
  });
});