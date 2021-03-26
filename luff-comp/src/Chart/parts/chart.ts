// import {LuffChartCtor} from "../types";
// import LuffChartInitializer from "./chart.initializer";
// import {ChartContentGraph} from "./chart.graph";
// import {ChartContentDraw} from "./chart.draw";
// import {LibraryDOM, LuffListener} from "luff";
//
//
//
// export class LuffChartClass {
//     private _t: number; //performance check
//     private isGraph: boolean;
//     private _ContentManager: any;
//     private _locked: boolean;
//
//     Target: HTMLElement;
//     Options: any;
//     Listener: any;
//     // get Content() : HTMLElement {
//     //     return this._ContentManager.Content;
//     // };
//
//     Redraw(Options?: any){
//         //let r = window.performance.now();
//         if (this._ContentManager.Content.clientHeight){
//             this._locked = true;
//             this._ContentManager.Redraw(Options);
//             setTimeout(()=>{
//                 this._locked = false;
//                 //this._t = window.performance.now() - this._t;
//                 //r = window.performance.now() - r;
//                 //console.log(`[Chart.Performance] ${Math.round(r)}ms (init:${Math.round(this._t)}ms)`)
//             })
//         }
//     }
//     Refresh(Options?){
//         if (!this._ContentManager.Options.Graph && !this._ContentManager.Options.Draws)
//             return this._ContentManager.Redraw(Options);
//         this._locked = true;
//         this._ContentManager.Refresh(Options);
//         setTimeout(()=>{
//             this._locked = false;
//         })
//         //
//         // this._ContentManager.Refresh();
//         //
//         // setTimeout(()=>{
//         //     this._t = window.performance.now() - this._t;
//         //     r = window.performance.now() - r;
//         //     console.log(`[Chart.Performance] ${Math.round(r)}ms (init:${Math.round(this._t)}ms)`)
//         // }, 0)
//     }
//     // get isGraph(){
//     //     return LuffChartInitializer.Type.Graph.indexOf(this.Options.Type) > -1
//     // }
//     SerieSwitch(SeriesNumber, SectorNumber){
//         let Series = this.Options.Series[SeriesNumber];
//         let LegendID = `legend-ch-${this._ContentManager.ID}-${SeriesNumber}`;
//         let isChecked;
//         if (Series.Type === 'pie' || Series.Type === 'ring'){
//             LegendID = `legend-ch-${this._ContentManager.ID}-${SeriesNumber}-${SectorNumber}`;
//             isChecked = !this.Options.Series[SeriesNumber].Visibles[SectorNumber];
//             this.Options.Series[SeriesNumber].Visibles[SectorNumber] = isChecked;
//         }
//         else{
//             isChecked = !this.Options.Series[SeriesNumber].Visible;
//             this.Options.Series[SeriesNumber].Visible = isChecked;
//         }
//         let Checkbox = <HTMLInputElement>document.getElementById(LegendID);
//         if (Checkbox)
//             Checkbox.checked = isChecked;
//         this.Refresh({Animation:false});
//     }
//     get Series(){
//         return this.Options.Series;
//     }
//     set Series(se){
//         this.Options.Series = se;
//         LuffChartInitializer.GetSeries(this.Options);
//     }
//
//     constructor(R: LuffChartCtor){
//         this._t = window.performance.now();
//         if (R.Disabled)
//             return;
//
//         this._locked = false;
//         this.Target = LibraryDOM.Select(R.Target);
//         LuffChartInitializer.InitR.call(this, R);
//
//         // if (this.Options.Height === 'auto' && this.Target.clientHeight === 0)
//         //     this.Target.style.height = LuffChartInitializer.Default.R.Height + 'px';
//
//         if (this.isGraph)
//             this._ContentManager = new ChartContentGraph(this);
//         else
//             this._ContentManager = new ChartContentDraw(this);
//
//
//         if (R.Responsible){
//             //wait 4 render
//             setTimeout(()=>{
//                 this.Listener = new LuffListener({
//                     Target: this._ContentManager.Content,
//                     Freq: 50,
//                     Delay: 50,
//                     OnEvent: ()=>{
//                         if (this.Listener.Height > 0 && !this._locked)
//                             this.Redraw({Animation: false});
//                     }
//                 });
//                 this.Listener.Run();
//             })
//         }
//         if (R.DrawAfterInit)
//         {
//             this.Redraw();
//         }
//     }
// }
//
//
//
//
//
//
//
