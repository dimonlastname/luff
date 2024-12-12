export enum ChartSeriesType {
    Unknown = 0,
    Line = 1,
    Bar = 2,
    Pie = 3,
}

export enum ChartPositionType {
    Left = 1,
    Right = 2,
    Top = 3,
    Bottom = 4,
}

const defaultOptions = {
    //Type: 'line',
    AxisX: {

    },
    AxisY: {

    },
    Legend: {

    },
    Series: [
        {
            Type: 'pie',
            Data: [{x: 0, y: 10}],
            Width: 40,
        },
        {
            Type: 'bar',
            Data: [{x: 0, y: 10}, {x: 5, y: 14}],
        },
        // new Chart.Line({
        //     Name: 'Income',
        //     AxisX: {
        //
        //     },
        //     Data: [{x: 0, y: 10}, {x: 5, y: 14}, null, {x: 6, y: 4}],
        // }),

    ]
};