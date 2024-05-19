import _ from 'lodash';


const swap = (items, i, j) => {
    const temp = items[i];
    items[i] = items[j];
    items[j] = temp;
};

const heapPermute = (n, items, callback) => {
    if (n === 1) {
        callback(items.slice());
    } else {
        for (let i = 0; i < n; i++) {
            heapPermute(n - 1, items, callback);
            if (n % 2 === 1) {
                swap(items, 0, n - 1);
            } else {
                swap(items, i, n - 1);
            }
        }
    }
};


const addPartialEv = (begin, end, idxsArr, refArr, totStacks, prizeRef, memo) => {
    let partialSum = totStacks;
    let p = 1;
    const key = idxsArr.slice(begin, end).join(',');
    if (memo[key]) {
        memo[key].forEach((val, idx) => {
            refArr[idxsArr[begin + idx]].ev += val * p;
        });
        return;
    }
    for (let i = begin; i < end; ++i) {
        const currentStack = refArr[idxsArr[i]].stack;
        p *= currentStack / partialSum;
        partialSum -= currentStack;
    }
    const values = [];
    for (let i = begin; i < end; ++i) {
        const value = prizeRef[i - begin] * p;
        refArr[idxsArr[i]].ev += value;
        values.push(value);
    }
    memo[key] = values;
};


const bruteForceICM = (plyRef, totalChips, prizeRef) => {
    const przidxs = [];
    _.forEach(prizeRef, (ply, idx) => {
        przidxs.push(idx);
    });

    const memo = {};

    heapPermute(przidxs.length, przidxs, (items) => {
        addPartialEv(0, przidxs.length, items, plyRef, totalChips, prizeRef, memo);
    });
};


const createPlayer = (stack) => ({
    stack: stack || 0,
    ev: 0, // Initialize EV to zero
});

export { bruteForceICM, createPlayer };
