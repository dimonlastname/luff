const CSS_BUTTON_BUSY = 'l-busy';

export namespace LibraryButton {
    export function Lock(button: HTMLButtonElement): void {
        button.disabled = true;
        button.classList.add(CSS_BUTTON_BUSY);
    }
    export function Unlock(button: HTMLButtonElement): void {
        button.disabled = false;
        button.classList.remove(CSS_BUTTON_BUSY);
        }
    export function Release(button: HTMLButtonElement): void {
            button.disabled = false;
            button.classList.remove(CSS_BUTTON_BUSY);
        }
}