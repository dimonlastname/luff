import {ComponentSimple, IObservableStateSimple, React} from "luff";

import "./BusyLocker.scss";

type TBusyWrapperProps = {
    isBusy: IObservableStateSimple<boolean>;
}

class BusyLocker extends ComponentSimple<TBusyWrapperProps> {
    Render() {
        return <div className="l-busy-locker" isVisible={this.props.isBusy}/>;
    }
}

export default BusyLocker;