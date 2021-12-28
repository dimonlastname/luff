const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
function sortComparer<T>(a: T, b: T, fieldName: keyof T) {

    let valueA = a[fieldName] as any;
    let valueB = b[fieldName] as any;

    if (valueA && valueA.localeCompare) { //if string and ok browser
        return collator.compare(valueA, valueB);
    }

    if (valueA > valueB)
        return 1;
    if (valueA < valueB)
        return -1;
    return 0;
}

export namespace LibraryArray {
    export function Remove<T>(list: T[], predicate: (o: T, index: number) => boolean) : number {
        let removedCount = 0;
        for (let i = list.length - 1; i >= 0; --i) {
            if (predicate(list[i], i)) {
                list.splice(i,1);
                removedCount++;
            }
        }
        return removedCount;
    }
    export function MoveByIndex<T>(list: T[], indexFrom: number, indexTo: number) : void {
        if (indexFrom === indexTo)
            return;
        const item = list[indexFrom];
        list.splice(indexFrom, 1);
        list.splice(indexTo, 0, item);
    }
    export function MoveByItem<T>(list: T[], item1: T, item2: T) : void {
        const indexFrom = list.indexOf(item1);
        const indexTo = list.indexOf(item2);
        MoveByIndex(list, indexFrom, indexTo);
    }

    export function SortByField<T>(list: T[], fieldName: keyof T) : T[]  {
        return list.sort((a, b) => sortComparer(a, b, fieldName));
    }
    export function FlattenObjects<T, U>(arr: T[], flatFn: (item: T) => U, subKey: keyof T) : U[] {
        return arr.reduce((resultArr, obj) => {
            return resultArr
                .concat((obj[subKey] as any)
                .map(flatFn));
        }, arr.map(flatFn));

    }
}