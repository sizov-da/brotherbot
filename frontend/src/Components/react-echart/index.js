import * as echarts from "echarts";
import Core from './core';

// export the Component the echarts Object.
export default class EchartsReact extends Core {
  /**
     * @param {any} props
     */
  constructor(props ) {
    super(props);
    this.echartsInstance = echarts;
  }
}
