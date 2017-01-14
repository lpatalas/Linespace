import * as React from 'react';
import * as ReactDOM from 'react-dom';

export interface SideMenuItemProps { action: any; title: string, icon: string, isSideMenuCollapsed: boolean }
export interface SideMenuItemState { }
export class SideMenuItemComponent extends React.Component<SideMenuItemProps, SideMenuItemState>{

    constructor() {
        super();

        this.state = { isSideMenuCollapsed: false };
    }

    render() {
        return (
            <li className="aside-menu__item">
                <a href="#" onClick={this.props.action} title={this.props.title}>
                    <i className={this.props.icon} aria-hidden="true"></i>
                </a>
                {
                    this.props.isSideMenuCollapsed ? "" :
                        <a href="#" onClick={this.props.action} title={this.props.title}>{this.props.title}</a>
                }
            </li>
        );
    }
}