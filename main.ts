// increase the number of elements to sort if possible
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if (currCount + 6 < screen.width / 2) {
        currCount += 6
        start()
    }
})
function ordinalIndicator (input2: number) {
    lastDigit = input2 % 10
    if (lastDigit == 1) {
        return "st"
    } else if (lastDigit == 2) {
        return "nd"
    } else if (lastDigit == 3) {
        return "rd"
    } else {
        return "th"
    }
}
// start over with a new seed
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    start()
})
// remove a sorting algorithm from the group of running sorts
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (running.length > 1) {
        moveRandom(running, notRunning)
start()
    }
})
// display a new sorting algorithm if possible
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (notRunning.length > 0) {
        moveRandom(notRunning, running)
start()
    }
})
// decrease the number of elements to sort if possible
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    if (currCount > 6) {
        currCount += 0 - 6
        start()
    }
})
function start () {
    const r = new Math.FastRandom();
currentRun += 1
    currentPlace = 1
    ySegment = Math.floor(screen.height / running.length)
    running.forEach(v => {
        while (v.a && v.a.length != 0)
            v.a.pop();
    });
running.forEach(v => v.a = fillWithDefault(r, currCount, ySegment - (image.font5.charHeight + 2)));
running.forEach(v => control.runInParallel(() => {
        const run = currentRun;
        v.place = undefined;
        v.algorithm(v.a);
        if (run === currentRun) {
            const place = currentPlace++;
            if (place === 1)
                music.powerUp.play();
            else if (place === running.length)
                music.wawawawaa.play();

            // ordinal indicator is 'st', 'nd', 'rd', or 'th'
            v.place = place + ordinalIndicator(place);
        }
    }));
}
let lastDigit = 0
let currCount = 0
let notRunning: SortingAlgorithm[] = []
let running: SortingAlgorithm[] = []
let currentRun = 0
let pauseDuration = 10
interface SortingAlgorithm {
    title: string;
    algorithm: (values: number[]) => number[];
    a?: number[];
    place?: string;
}
currCount = 26
let ySegment: number;
let currentPlace: number;
addExample("selection sort", sorts.selectionSort);
addExample("insertion sort", sorts.insertionSort);
addExample("bubble sort", sorts.bubbleSort);
addExample("shell sort", sorts.shellSort);
addExample("heap sort", sorts.heapSort);
addExample("quick sort", sorts.quickSort);
addExample("merge sort", sorts.mergeSort);
// Start off with two random algorithms running
for (let index = 0; index < 2; index++) {
    moveRandom(notRunning, running);
}
start()
game.onPaint(() => {
    running.forEach(function (value: SortingAlgorithm, index: number) {
        drawCurrentState(value, currCount, ySegment, index * ySegment);
    });
});
function moveRandom<T>(a: T[], b: T[]) {
    if (a.length > 0) {
        const j = randint(0, a.length - 1);
        b.push(a.removeAt(j));
    }
}
function addExample(title: string, sortAlgorithm: (values: number[]) => number[]) {
    let output: SortingAlgorithm = {
        title: title,
        algorithm: sortAlgorithm
    }
    notRunning.push(output);
}
function fillWithDefault(r: Math.FastRandom, count: number, maxHeight: number): number[] {
    // reset seed so that output is consistent
    r.reset();
    let output2: number[] = [];

    for (let k = 0; k < count; ++k) {
        output2.push(r.randomRange(0, maxHeight));
    }

    return output2;
}
function drawCurrentState(s: SortingAlgorithm, count: number, height: number, yOffset: number) {
    const a = s.a
    const title = s.title;
    const lineWidth = Math.floor(screen.width / count) - 1;
    const borderWidth = (screen.width - (count * (lineWidth + 1))) / 2;

    for (let l = 0; l < a.length; ++l) {
        if (a[l] > 0) {
            const maxValue = ySegment - (image.font5.charHeight + 2);
            // pick color between 0x1 and 0xE based on value
            let c = Math.clamp(0x1, 0xE, Math.floor(a[l] * 14 / maxValue));
            screen.fillRect(borderWidth + l * (lineWidth + 1), height + yOffset - a[l], lineWidth, a[l], c);
        }
    }

    screen.print(title, borderWidth, yOffset + 1, 0x2, image.font5);
    if (s.place)
        screen.print(s.place, borderWidth, yOffset + 3 + image.font5.charHeight, 0x2, image.font5);
}
namespace sorts {
    function swap(a: number[], i: number, j: number) {
        let tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
        pause(pauseDuration);
    }

    function compare(a: number, b: number) {
        pause(pauseDuration)
        return a < b;
    }

    export function insertionSort(a: number[]) {
        for (let m = 0; m < a.length; m++) {
            let value = a[m]
            let n: number;
            for (n = m - 1; n > -1 && compare(value, a[n]); --n) {
                a[n + 1] = a[n];
                pause(pauseDuration);
            }
            a[n + 1] = value;
        }

        return a;
    }

    export function selectionSort(a: number[]) {
        for (let o = 0; o < a.length; o++) {
            let min = o;
            for (let p = o + 1; p < a.length; p++) {
                if (compare(a[p], a[min])) {
                    min = p;
                    pause(pauseDuration);
                }
            }
            if (o !== min) {
                swap(a, o, min);
            }
        }

        return a;
    }

    export function bubbleSort(a: number[]) {
        for (let q = 0; q < a.length; ++q) {
            for (let s = 0; s < q; ++s) {

                if (compare(a[q], a[s])) {
                    swap(a, q, s);
                }
            }
        }

        return a;
    }

    export function shellSort(a: number[]) {
        let increment = a.length / 2;
        while (increment > 0) {
            for (let t = increment; t < a.length; ++t) {
                let u = t;
                let v = a[t];

                while (u >= increment && compare(v, a[u - increment])) {
                    a[u] = a[u - increment];
                    u = u - increment;
                    pause(pauseDuration);
                }
                a[u] = v;
            }

            if (increment == 2) {
                increment = 1;
            } else {
                increment = Math.floor(increment * 5 / 11);
            }
        }

        return a;
    }

    export function quickSort(a: number[]) {
        qsort(a, 0, a.length - 1);
        return a;

        function qsort(a: number[], lo: number, hi: number) {
            if (lo < hi) {
                let w = partition(a, lo, hi);
                qsort(a, lo, w - 1);
                qsort(a, w + 1, hi);
            }
        }

        function partition(a: number[], lo: number, hi: number) {
            let pivot = a[hi];
            let b = lo - 1;

            for (let d = lo; compare(d, hi); ++d) {
                if (a[d] < pivot) {
                    b++;
                    swap(a, b, d);
                }
            }

            swap(a, b + 1, hi);
            return b + 1;
        }
    }

    export function heapSort(a: number[]) {
        function buildMaxHeap(a: number[]) {
            let e = Math.floor(a.length / 2 - 1);

            while (e >= 0) {
                heapify(a, e, a.length);
                e -= 1;
            }
        }

        function heapify(heap: number[], i: number, max: number) {
            while (i < max) {
                const left = 2 * i + 1;
                const right = left + 1;
                let curr = i;

                if (left < max && compare(heap[curr], heap[left])) {
                    curr = left;
                }

                if (right < max && compare(heap[curr], heap[right])) {
                    curr = right;
                }

                if (curr == i) return;

                swap(heap, i, curr);
                i = curr;
            }
        }
        buildMaxHeap(a);

        for (let f = a.length - 1; f > 0; --f) {
            swap(a, 0, f);
            heapify(a, 0, f);
        }

        return a;
    }

    export function mergeSort(a: number[]) {
        // Typically, you wouldn't keep an 'offset' or a link to the 'original' array,
        // as the sort works by returning a new, sorted array as output - not by modifying
        // the one passed as input. Here, though, it is needed so that the preview on the
        // screen can be updated
        function msort(a: number[], offset: number, original: number[]): number[] {
            if (a.length < 2) {
                return a;
            }

            const middle = Math.floor(a.length / 2);

            let left2 = a.slice(0, middle);
            let right2 = a.slice(middle, a.length);

            left2 = msort(left2, offset, original);
            right2 = msort(right2, offset + middle, original);

            const merged = merge(left2, right2);

            // Update preview on screen
            merged.forEach(function (value: number, index: number) {
                original[offset + index] = value;
                pause(pauseDuration);
            });

            return merged;
        }

        function merge(left: number[], right: number[]) {
            let result = [];
            let lIndex = 0;
            let rIndex = 0;

            while (lIndex < left.length && rIndex < right.length) {
                if (compare(left[lIndex], right[rIndex])) {
                    result.push(left[lIndex]);
                    ++lIndex;
                } else {
                    result.push(right[rIndex]);
                    ++rIndex;
                }
            }
            while (lIndex < left.length) {
                result.push(left[lIndex]);
                ++lIndex;
            }
            while (rIndex < right.length) {
                result.push(right[rIndex]);
                ++rIndex;
            }
            return result;
        }

        return msort(a, 0, a);
    }

    export function isSorted(a: number[]) {
        for (let g = 1; g < a.length; ++g) {
            if (a[g - 1] > a[g]) {
                return false;
            }
        }
        return true;
    };
}
