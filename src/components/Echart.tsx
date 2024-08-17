import {
  EChartsOption,
  EChartsType,
  init as EchartInit,
  getInstanceByDom,
} from "echarts";
import { HTMLAttributes, useEffect, useRef } from "react";
import { debounce } from "lodash-es";

export type EchartProps = {
  options: EChartsOption;
} & HTMLAttributes<HTMLDivElement>;

export default function Echart(props: EchartProps) {
  const { options, ...config } = props;
  const cDom = useRef<HTMLDivElement>(null);
  const cInstance = useRef<EChartsType>();

  useEffect(() => {
    if (!cDom.current) return;
    cInstance.current = getInstanceByDom(cDom.current);
    if (!cInstance.current) {
      cInstance.current = EchartInit(cDom.current);
    }
    options && cInstance.current.setOption(options);

    return () => {
      cInstance.current?.dispose();
    };
  }, [cDom, options]);

  // 窗口自适应并开启过渡动画
  const resize = () => {
    if (cInstance.current) {
      cInstance.current.resize({
        animation: { duration: 300 },
      });
    }
  };

  const debounceResize = debounce(resize, 500);

  // 监听窗口大小
  useEffect(() => {
    window.addEventListener("resize", debounceResize);

    return () => {
      window.removeEventListener("resize", debounceResize);
    };
  }, []);

  return <div ref={cDom} {...config}></div>;
}
