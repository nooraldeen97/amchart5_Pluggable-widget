import { Component, createElement } from "react";

import { HelloWorldSample } from "./components/HelloWorldSample";
import "./ui/BarAmChart.css";

export default class BarAmChart extends Component {
    render() {
        return <HelloWorldSample {...this.props} />;
    }
}
