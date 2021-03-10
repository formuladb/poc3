import { createTree } from './createTree';

test('should create the category tree correctly', () => {
    let tree = createTree(['A', 'A.1', 'A.1.1', 'A.2.1', 'A.3.1.1', 'B']);
    expect(tree).toEqual([
        {
            id: 'A',
            name: 'A',
            category: '',
            children: [{
                id: 'A.1',
                name: '1',
                category: 'A',
                children: [{ id: 'A.1.1', name: '1', category: 'A.1'}]
            },{
                id: 'A.2',
                name: '2',
                category: 'A',
                children: [{id: 'A.2.1', name: '1', category: 'A.2'}]
            },{
                id: 'A.3',
                name: '3',
                category: 'A',
                children: [{
                    id: 'A.3.1',
                    name: '1',
                    category: 'A.3',
                    children: [{id: 'A.3.1.1', name: '1', category: 'A.3.1'}],
                }]
            }]
        },
        { id: 'B', name: 'B', category: '' }
    ])
});
