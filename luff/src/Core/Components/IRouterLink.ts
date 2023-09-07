export interface IRouteLink {
    SetActive(isActive: boolean) : void;
    IsContainsElement(elem: HTMLElement) : boolean;
    CheckPermission(): void;
    //CheckForAvailability(): void;
    //Hide() : void;
}