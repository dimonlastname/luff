## 4.1.3
* StateArray.Add(item) теперь возвращает стейт только что добавленного элемента

## 4.1.2
* Изменено поведение `onChange` для `textarea` - теперь работает так же как и `input` (`TextBox`)
* Исправлено отсутсвие вызова `OnAppear`, если компонент находился внутри "видимого" обычного элемента
* Изменено поведение `OnOutsideClick` - теперь триггерится при `mousedown`, вместо `mouseup` (`click`) 
* Исправлен FlowHint в `luff-comp`


## 4.1.0

### Новый механизм динамического рендера.

"Старые" элементы удаляются через `.Dispose()` - отписываются от всех listeners и очищают все объекты

Теперь доступно добавление нового элемента в компонентах через `this.AppendChild(render)`


### Прочее

* Оптимизированы `Appear` и `Disappear` компонентов.
* fix global periodPicker
* удалено переопределение scrollbar браузера по умолчанию


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
