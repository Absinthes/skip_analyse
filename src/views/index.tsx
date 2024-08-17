import type { UploadProps } from "antd";
import { message, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { parseExcelToJson } from "@/utils";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import Echart from "@/components/Echart";
import { EChartOption } from "echarts";
dayjs.extend(duration);

const { Dragger } = Upload;

type state = {
  time: string;
  current: number;
  other: number;
};

export default function Index() {
  const [sheetData, setSheetData] = useState<Record<any, any>[]>([]);

  const [data, setData] = useState<state[]>([]);

  const [options, setOptions] = useState({});

  const map = useRef(new Map());

  const props: UploadProps = {
    name: "file",
    async onChange(info) {
      console.log(info);

      const file = info.file.originFileObj;

      parseExcelToJson(file, ({ list }) => {
        setSheetData(list.slice(1) || []);
      });
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  useEffect(() => {
    if (sheetData.length == 0) return;
    const list: state[] = [];
    sheetData.reduce((a, b) => {
      const timeA = dayjs
        .duration(Number(a["时长"]), "seconds")
        .format("mm:ss");
      const timeB = dayjs
        .duration(Number(b["时长"]), "seconds")
        .format("mm:ss");

      const obj: state = {
        time: `${timeA} - ${timeB}`,
        current: (a["当前作品留存率"] - b["当前作品留存率"]) * 100,
        other: (a["大盘同时长作品留存率"] - b["大盘同时长作品留存率"]) * 100,
      };

      map.current.set(obj.time, obj);

      list.push(obj);

      return b;
    });

    const xAxisData = list.map((it) => it.time);
    const currentData = list.map((it, idx) => Number(it.current.toFixed(2)));
    const lineData = list.map((it) => Number(it.other.toFixed(2)));

    const obj: EChartOption = {
      color: [
        "#ee6666",
        // "#3ba272",
        "#5470c6",
        "#91cc75",
        "#fac858",
        "#73c0de",
        "#3ba272",
        "#fc8452",
        "#9a60b4",
        "#ea7ccc",
      ],
      tooltip: {
        trigger: "axis",
        axisPointer: {
          animation: true,
        },
        valueFormatter: (value) => value.toFixed(2) + "%",
      },
      dataZoom: [
        {
          type: "slider",
          show: true,
          startValue: 0, // 数据窗口范围的起始数值
          endValue: 20, // 数据窗口范围的结束数值（一页显示多少条数据）
        },
        {
          type: "inside",
          // zoomLock: true,
          zoomOnMouseWheel: false,
          // 鼠标滚轮触发滚动
          moveOnMouseMove: true,
          moveOnMouseWheel: true,
        },
      ],
      legend: {},
      xAxis: {
        type: "category",
        data: xAxisData,
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "大盘",
          data: lineData,
          type: "line",
          showSymbol: false,
        },
        {
          name: "当前作品",
          data: currentData,
          type: "bar",
          itemStyle: {
            color: (params) => {
              console.log(params);
              const value = map.current.get(params.name) as state;
              if (value.current > value.other) return "#ee6666";
              return "#5470c6";
            },
          },
        },
      ],
    };

    setOptions(obj);

    setData(list);
  }, [sheetData]);

  return (
    <>
      <div className="p-5">
        <Dragger {...props} maxCount={1}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibited from
            uploading company data or other banned files.
          </p>
        </Dragger>
      </div>

      <div className="h-400px">
        <Echart className="w-full h-full" options={options} />
      </div>
    </>
  );
}
