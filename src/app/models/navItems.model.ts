export interface NavItem {
    displayName: string;
    disabled: boolean;
    iconName: string;
    route: string;
    children: Array<NavItem>;
    toolTip: string;
    bottom: boolean;
}
