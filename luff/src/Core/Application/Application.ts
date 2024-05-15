import AppRouter from "./Route";
import {AppSettings} from "./Settings";
import {IElement} from "../Components/IElement";


let rootDOM;

const Application = {
    Entry: <string>null,
    IsRun: false,
    RootElementID: 'root',
    RootElement: null as HTMLElement,
    RootComps: [] as IElement[],

    Settings: AppSettings,
    Run(entryContentRouteName?: string) {
        if  (Application.IsRun)
            return console.warn('Luff Application is already run');

        rootDOM = document.getElementById(Application.RootElementID);
        Application.RootElement = rootDOM;

        // if (AppRouter.Enabled && !document.location.hash && localStorage.getItem('LuffRoute'+document.location.href.split("#")[0])){
        //     document.location.hash = localStorage.getItem('LuffRoute'+document.location.href.split("#")[0]);
        //     localStorage.setItem('LuffRoute'+document.location.href.split("#")[0], '');
        // }
        Application.IsRun = true;
        const roots = [...AppRouter.ContentRoot]; // to prevent change collection on content unregister;
        let perf = window.performance.now();
        for (let ctn of roots) {
            ctn._InitializeComponent();
            if (!ctn.HasPermission)
                continue;
            ctn._GenerateDOM();
            ctn._Mount(true);
            if (ctn._IsShown && ctn._IsMount){
                ctn._Appear();
            }
            // const dom = ctn._GenerateDOM();
            // if (dom) {
            //     rootDOM.appendChild(dom);
            // }
        }
        this.RootComps = roots;
        let perAppend = window.performance.now();
        //console.info(`[Luff.Application.Perf] AppendDOM:   `, perAppend - perfGen);
        console.info(`[Luff.Application.Perf] Build total: `, perAppend - perf, 'ms');

        //GenerateRouteLinks();
        let routeStat = 0;
        const savedPath = localStorage.getItem('LuffRoute' + document.location.href.split("#")[0]);

        if (AppRouter.Enabled) {
            if (savedPath && document.location.hash.length === 0) {
                routeStat = AppRouter.GoTo(savedPath);
            }
            if (routeStat < 1) {
                routeStat = AppRouter.OnPopState(void 0);
            }
        }

        try {

        }
        catch (e) {
            console.warn('[Luff.Application] RunByRoute error. Wrong route or not enough permission');
            console.warn(e);
        }
        if (Application.Entry && routeStat < 1){
            //AppRouter._PopState = false; //to push  entry route
            let ctn = AppRouter.ContentByRouteName[Application.Entry];
            console.log('Luff.Application.Entry', Application.Entry, ctn);
            if (ctn)
                ctn.Show();
        }
    },


    RestorePath() : void {
        document.location.hash = localStorage.getItem('LuffRoute');
        localStorage.setItem('LuffRoute', '');
    },
    SavePath() : void {
        localStorage.setItem('LuffRoute' + document.location.href.split('#')[0], document.location.hash.substring(1));
    }
};


export default Application