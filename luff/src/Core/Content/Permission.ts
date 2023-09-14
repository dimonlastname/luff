import {ContentTypes, IContent} from "./IContent";
import {Dict, DictN} from "../../interfaces";
import {PropTypes} from "../../Library/PropTypes";
import {LibraryObject} from "../../Library/Object";

const PermissionActionTypes= {
    Hide: 1,
    Remove: 2,
};

let Default: ContentTypes.Permission = {
    //Attribute: 'data-permission',
    IsHideControls: true,
    OnDeny: () => void 0,
    Roles: [],
    Write: [],
    Rules: {},
    Action: {
        Hide: (Element: HTMLElement) => {if (Element) Element.style.display = 'none'},
        Show: (Element: HTMLElement) => {if (Element) Element.style.display = ''},
        Remove: (Element: HTMLElement) => {if (Element) Element.remove();},
    },
    ActionType: PermissionActionTypes.Hide,
};

interface IPermissionManagerSettings {
    Strict: boolean;
    Default: ContentTypes.Permission
}

const PermissionManSettings : IPermissionManagerSettings = {
    Strict: false,  //if true: drop content if has no permission (don't render or init at all)
    Default: Default
};


export class LuffContentUserPermission {
    Roles: number[] = [];
    SubRolesByID: DictN<number[]> = {};
}
export const appUserPermission = new LuffContentUserPermission();


export class PermissionManager {
    static Settings = PermissionManSettings;
    static Actions: Dict<Number> = PermissionActionTypes;

    Attribute: string;
    RuleNames: string[] = [];
    _IsAllow: boolean = true;
    _IsAllowWrite: boolean = true;

    get IsAllow() {
        return this._IsAllow;
    }
    get IsAllowWrite() {
        return this._IsAllowWrite;
    }
    IsAllowByRule(rule: string) : boolean {
        if (this._IsAllowByRule[rule] === void 0) {
            if (!this._Owner.ParentComponent) {
                return true;
            }
            return this._Owner.ParentComponent.Permission.IsAllowByRule(rule);
        }
        return this._IsAllowByRule[rule];
    }
    IsAllowWriteByRule(rule: string) : boolean {
        if (this._IsAllowWriteByRule[rule] === void 0)
            return true;
        return this._IsAllowWriteByRule[rule];
    }
    _IsAllowByRule: Dict<boolean> = {};
    _IsAllowWriteByRule: Dict<boolean> = {};

    get IsHideControls() {
        return this._ctor.IsHideControls;
    }
    get OnDeny() {
        return this._ctor.OnDeny;
    }

    _Owner: IContent;
    _ctor: ContentTypes.Permission;

    _CheckRole(role: number | Dict<number>) : boolean {
        const content = this._Owner;
        const appUser = appUserPermission;
        if (PropTypes.GetType(role) === 'number'){
            const numericRole = <number>role;
            return  (appUser.Roles.includes(numericRole) || (appUser.Roles.includes[numericRole] && appUser.Roles.includes[numericRole].length > 0));
        }
        else {
            const complexRole = <Dict<number>>role;

            for (let subRoleProperty in complexRole){              //ex.  Role: {PropertyName: RoleWithSubID}, like:  Role = {'ID':1488} for proto, or {'.ID':228} for Controller item
                if (complexRole.hasOwnProperty(subRoleProperty)){         //'ID'
                    let RoleValue = complexRole[subRoleProperty];  //1488
                    if (appUser.SubRolesByID[RoleValue]){     //ex. Luff.User.SubRoles = {1488:[12,13,15], 228:[5,10,13],...}
                        let state;
                        let Property = subRoleProperty;
                        if (subRoleProperty.substring(0,1) === '.'){  // '.ID' - Controller.Data[i].ID
                            Property = subRoleProperty.substring(1);
                        }
                        else {                                        //  'ID'  - Proto.Data.ID
                            state = content.State.SValue;
                        }
                        let SubRoleValue = LibraryObject.GetProperty(state, Property);
                        let isOk = appUser.SubRolesByID[complexRole[subRoleProperty]].includes(SubRoleValue) ||
                            appUser.SubRolesByID[complexRole[subRoleProperty]].includes(-1) ;
                        if (isOk)
                            return isOk;
                    }
                }
            }
        }
    }
    _CheckRoles(RolesRequired: number[] | Dict<number>[]){

        if (!RolesRequired || RolesRequired.length < 1 || (<number[]><any[]>RolesRequired).includes(-1) ){
            return true;
        }
        for (let i = 0; i < RolesRequired.length; i++){
            let Role = RolesRequired[i];
            if (this._CheckRole(Role)){
                return true;
            }
        }
        return false;
    }
    _HasMainPermission(){
        let RolesRequired = this._ctor.Roles;
        if (RolesRequired.length < 1 || (<number[]>RolesRequired).includes(-1)){
            return true;
        }
        for (let i = 0; i < RolesRequired.length; i++){
            let Role = RolesRequired[i];
            if (this._CheckRole(Role)){
                return true;
            }
        }
        // if (this._ctor.Action)
        //     this._ctor.Action.call(this);
        return false;
    }
    _HasMainWritePermission(){
        let RolesRequired = this._ctor.Write;
        if (RolesRequired.length < 1 || (<number[]>RolesRequired).includes(-1)){
            return true;
        }
        for (let i = 0; i < RolesRequired.length; i++){
            let Role = RolesRequired[i];
            if (this._CheckRole(Role)){
                return true;
            }
        }
        return false;
    }

    Check(){
        /* checking permission to luff content at all */
        this._IsAllow      = (!this._Owner.ParentComponent || this._Owner.ParentComponent.Permission.IsAllow ) && this._HasMainPermission();
        this._IsAllowWrite = (!this._Owner.ParentComponent || this._Owner.ParentComponent.Permission.IsAllowWrite ) && this.IsAllowWrite && this._HasMainWritePermission();

        /* check rules */
        for (let RuleName of Object.getOwnPropertyNames(this._ctor.Rules)){
            this._IsAllowByRule[RuleName] = this._CheckRoles(this._ctor.Rules[RuleName].Roles);
            this._IsAllowWriteByRule[RuleName] = this._CheckRoles(this._ctor.Rules[RuleName].Write);
        }
    }

    constructor(cfg: ContentTypes.Permission, Owner: IContent){
        this._Owner = Owner;

        cfg = {
            ...Default,
            ...cfg,
        };
        // cfg = cfg !== void 0 ? cfg: LibraryObject.Clone(PermissionManager.Settings.Default);
        // //cfg.Attribute = cfg.Attribute !== void 0 ? cfg.Attribute : Default.Attribute;
        // cfg.IsHideControls = cfg.IsHideControls !== void 0 ? cfg.IsHideControls : Default.IsHideControls;
        // cfg.OnDeny = cfg.OnDeny !== void 0 ? cfg.OnDeny : Default.OnDeny;
        //
        // cfg.Roles = cfg.Roles !== void 0 ? cfg.Roles : Default.Roles;
        // cfg.Write = cfg.Write !== void 0 ? cfg.Write : Default.Write;
        // //cfg.Users = cfg.Users !== void 0 ? cfg.Users : Default.Users;
        //
        // cfg.Rules = cfg.Rules !== void 0 ? cfg.Rules : Default.Rules;
        //
        // cfg.Action = cfg.Action !== void 0 ? cfg.Action : Default.Action;
        // cfg.Action.Hide = cfg.Action.Hide !== void 0 ? cfg.Action.Hide : Default.Action.Hide;
        // cfg.Action.Show = cfg.Action.Show !== void 0 ? cfg.Action.Show : Default.Action.Show;
        // cfg.Action.Remove = cfg.Action.Remove !== void 0 ? cfg.Action.Remove : Default.Action.Remove;

        for (let RuleName of Object.getOwnPropertyNames(cfg.Rules)){
            cfg.Rules[RuleName].Roles = cfg.Rules[RuleName].Roles !== void 0 ? cfg.Rules[RuleName].Roles : [];
            cfg.Rules[RuleName].Write = cfg.Rules[RuleName].Write !== void 0 ? cfg.Rules[RuleName].Write : [];
            //cfg.Rules[RuleName].Users = cfg.Rules[RuleName].Users !== void 0 ? cfg.Rules[RuleName].Users : [];

            this._IsAllowByRule[RuleName] = true;
            this._IsAllowWriteByRule[RuleName] = true;
            this.RuleNames.push(RuleName);
        }

        //this.Attribute = cfg.Attribute;
        this._ctor = cfg;

        this.Check();
    }
}
