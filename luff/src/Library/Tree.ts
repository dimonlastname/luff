export namespace LibraryTree {
    export function IsExists<T>(tree: T[], subKey: (keyof T), searchFn: (item: T) => boolean) : boolean {
        for (let item of tree) {
            if (searchFn(item))
                return true;
            if (IsExists(item[subKey] as any as T[], subKey, searchFn))
                return true;
        }
        return false;
    }
    export function Flatten<T, U>(tree: T[], subKey: (keyof T), selector: (item: T) => U = item => item as any as U) : U[] {
        let res = [];
        for (let item of tree) {
            res.push(selector(item));
            res.push(...Flatten(item[subKey] as any as T[], subKey, selector));
        }
        return res;
    }
    export function Map<T, U>(tree: T[], subKey: (keyof T), selector: (item: T) => U = item => item as any as U) : U[] {
        let res = [];
        for (let item of tree) {
            let newItem = selector(item) as U;
            (newItem as any)[subKey] = Map(item[subKey] as any as T[], subKey, selector);
            res.push(newItem);
        }
        return res;
    }
    export function Filter<T, U>(tree: T[], subKey: (keyof T), predicate: (item: T) => boolean, isDropBranch: boolean = false) : T[] {
        let res = [];
        for (let item of tree) {
            let newItem;
            const isPassed = predicate(item);
            if (isPassed) {
                newItem = {...item};
                newItem[subKey] = Filter(newItem[subKey], subKey, predicate);
                res.push(newItem);
            }
            else if (!isPassed && isDropBranch) {
                //res.push(...Filter(item[subKey] as any, subKey, predicate));
            }
            else if (!isPassed && !isDropBranch) {
                res.push(...Filter(item[subKey] as any, subKey, predicate));
            }
        }
        return res;
    }
    export function Find<T, U>(tree: Iterable<T>, subKey: (keyof T), predicate: (item: T) => boolean) : T {
        for (let item of tree) {
            if (predicate(item)) {
                return item;
            }
            else {
                let found = Find(item[subKey] as any, subKey, predicate);
                if (found) {
                    return found;
                }
            }
        }
        return null;
    }

    function ForEachProcess<T, U>(tree: Iterable<T>, subKey: (keyof T), action: (item: T, parent: T, depth: number) => void, parent: T, depth: number) : void {
        for (let item of tree) {
            action(item, parent, depth);
            ForEachProcess((item as any)[subKey], subKey, action, item, depth + 1);
        }
    }
    export function ForEach<T, U>(tree: Iterable<T>, subKey: (keyof T), action: (item: T, parent: T, depth: number) => void) : void {
        for (let item of tree) {
            action(item, null, 0);
            ForEachProcess((item as any)[subKey], subKey, action, item, 1);
        }
    }

    function ForEachFromReverseProcess<T, U>(tree: Iterable<T>, subKey: (keyof T), action: (item: T, parent: T) => void, parent?: T) : void {
        for (let item of tree) {
            ForEachFromReverseProcess((item as any)[subKey], subKey, action, item);
            action(item, parent);
        }
    }
    export function ForEachReverse<T, U>(tree: Iterable<T>, subKey: (keyof T), action: (item: T, parent: T) => void) : void {
        for (let item of tree) {
            ForEachFromReverseProcess((item as any)[subKey], subKey, action, item);
            action(item, null);
        }
    }
}