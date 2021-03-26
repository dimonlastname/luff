export type TChartAnimation = {
    Bar: string;
    Line: string;
    Marker: string;
    Pie: string;
    Ring: string;
}

export const defaultAnimation : TChartAnimation= {
    Bar: 'l-animate-svg-bar', //'' or false for disable
    Line: 'l-animate-svg-line',
    Marker: 'l-animate-svg-mark',
    Pie: 'l-animate-svg-pie',
    Ring: 'l-animate-svg-ring',
};