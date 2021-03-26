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
}