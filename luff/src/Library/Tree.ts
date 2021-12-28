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
    export function Filter<T, U>(tree: T[], subKey: (keyof T), predicate: (item: T) => boolean) : T[] {
        let res = [];
        for (let item of tree) {
            let newItem;
            if (predicate(item)) {
                newItem = {...item};
                newItem[subKey] = Filter(newItem[subKey], subKey, predicate);
                res.push(newItem);
            }
        }
        return res;
    }
    export function ForEach<T, U>(tree: T[], subKey: (keyof T), action: (item: T) => void) : T[] {
        let res = [];
        for (let item of tree) {
            action(item);
            ForEach((item as any)[subKey], subKey, action);
        }
        return res;
    }
}