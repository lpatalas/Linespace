import * as React from 'react';

export class SimplePopupComponent extends React.Component<undefined, undefined> {
    render() {
        return (
            <div className="single-popup-container">

                <div className="container__header appear-animation">
                    <div className="circle__box">
                        {/*<svg xmlns="http://www.w3.org/2000/svg" className="header-icon">
                            <circle className="circle rotate" cx="21" cy="21" r="20" strokeLinecap="round" strokeDasharray="5,5" fill="none" />
                        </svg>*/}
                    </div>
                    <div className="horizontal-line__block"><span className="horizontal-line extend-horizontal"></span></div>
                </div>

                <div className="container__body extend">
                    <div className="container__body-blurred"></div>
                    <div className="container__body__content">
                        <div className="container__body__content__inner-content">

                                <table>
                                    <thead>
                                        <tr>
                                            <td>Name</td>
                                            <td>Amount</td>
                                            <td>volume</td>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr>
                                            <td>Iron</td>
                                            <td>1 000 000</td>
                                            <td>m^3</td>
                                        </tr>
                                        <tr>
                                            <td>Coal</td>
                                            <td>13 000 000</td>
                                            <td>m^3</td>
                                        </tr>
                                    </tbody>
                                </table>
                        </div>
                    </div>

                </div>

            </div>

        );
    }
}