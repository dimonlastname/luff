const data = {
    Title: '',
    Type: 'pie',
    Legend: {
        Visible: true,
    },
    AxisX: {
        Name: 'time, s',
        Data: [10, 20, 30, 40, 50],

        Start: 'auto',
        End: 'auto',
        Step: 'auto',
        Skip: null,
        //Skip: 30,
        //Skip: (value)=>{return value},
        Linear: true, // false if Skip is a function

    },
    AxisY: {
        Name: 'income, $',
        Position: 'left',
        Min:  'auto',
        Max:  'auto',
        Step: 'auto',
    },

};