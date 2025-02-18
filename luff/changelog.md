## 4.0.0

### Добавлен динамический рендер.

Для слишком сложных мультизависимых компонентов или присутствия большого количества элементов, но только малое количество из них должно быть отображено, можно использовать режим *динамического рендера*.

Способы применения:
* Перендерить компонент вручную `this.SomeComp.RenderForce();`
* Ререндер в `DynamicRenderComponent` (`Luff.ComponentDynamic`) при изменении `deps`  
* Ререндер в `Each` при включении параметра `isDynamicRenderModeEnabled={true}` и изменении `deps`

### Lazy-render

Для сохранения баланса между быстрой работой приложения и скоростью её первичной загрузки (рендера) можно часть компонентов отправить в ***lazy-render***
 
* Для определеного компонента включить флаг `IsLazyRenderEnabled = true`:
```ts
protected Ctor(): TContentCtor {
    return {
        ...
        IsLazyRenderEnabled: true,
    };
}
```
* Также можно включить глобально для всех компонентов с заданным `Route` [experimental] 
```
Luff.Application.Settings.IsLazyRenderEnabledByDefault = true;
```
Рендер выполнится при переходе по `Route` и `RouteLink` или прямом вызове `.Show()`. 

> 
> **( ! ) Если компонент не имеет явных или косвенных вызовов `Show` (например *Header*) он никогда не будет отрисован.**
> 


### Прочее

* Применена более строгая типизация `IObservable`
* `Luff.State<IElem[]>([])` теперь возвращает  `IObservableStateArray<IElem>`. Аналогичное поведение для `SubState` и пр.

## v3.3.x

### Плюшка для склеивания строк и стейтов<string> `Luff.State.Concat`

Нужна, как правило, для сборки className элемента, который, почти всегда, может быть как строкой, так и стейтом:

```tsx
type TExampleProps = {
    className: IObservableOrValue<string>;
}
class Example extends Luff.Content<TExampleProps>{
    Render(): Luff.Node {
        return (
            <div className={Luff.State.Concat("example-main-class", this.props.className)}> </div>
        )
    }
}
```
В зависимости от того что напихано в `Luff.State.Concat` будет либо строка, либо стейт со всеми необходимыми зависимостями.
На выходе будет разделено пробелами. C кастомным разделителем есть `Luff.State.Concat.WithSeparator`.

### Плюшка для дебага 

* Включаем дебаг режим `Luff.Application.Debug = true;`
* В инспекторе браузера выбираем элемент
* Видим путь элемента в `data-comp-path`, например `data-comp-path="Libris > ReaderService > BookList > BookItem"` 
* У дом элемента добавлено свойство `luffContent`, в котором ссылка на компонент в котором он рендерится
