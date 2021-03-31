export function shallowEquals(a, b) {
    if (typeof a !== 'object' || typeof b !== 'object') return a === b;

    for(var key in a) {
        if(!(key in b) || a[key] !== b[key]) {
            return false;
        }
    }
    for(var key in b) {
        if(!(key in a) || a[key] !== b[key]) {
            return false;
        }
    }
    return true;
}

export function shallowEqualsProps(a, b) {
    if (typeof a !== 'object' || typeof b !== 'object') return a === b;

    for(var key in a) {
        if(!(key in b) || !shallowEquals(a[key], b[key])) {
            console.log(`Render because ${key} has changed`);
            return false;
        }
    }
    
    return true;
}
