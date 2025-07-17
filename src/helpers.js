// Return a keys from array of object
export function pluck(setA, Key) {
    const keys = new Set();
    for (const value of setA) {
        if (value.hasOwnProperty(Key)) {
            keys.add(value[Key]);
        }
    }

    return keys;
}

// Return the difference of `setA` and `setB` if `setA` is a superset of `setB`
export function difference(setA, setB) {
    const diff = new Set();
    for (const value of setA) {
        if (!setB.has(value)) {
            diff.add(value);
        }
    }

    return diff;
}
