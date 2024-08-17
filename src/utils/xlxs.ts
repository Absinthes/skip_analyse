import { read, utils } from "xlsx";

export const parseExcelToJson = function (fileBlob, onloadCallback) {
  let code = 0;
  let message = "";
  let list = [];
  //验证文件格式
  if (!/.(xls|xlsx)$/.test(fileBlob.name.toLowerCase())) {
    message = "上传格式不正确，请上传xls或者xlsx格式";
    code = 1;
    return { code, message, list };
  }

  //解析文件
  const fileReader = new FileReader();
  fileReader.onload = (ev) => {
    try {
      const data = ev.target.result;

      // 以二进制流方式读取得到整份excel表格对象
      const workbook = read(data, {
        type: "binary",
      });

      let index = 1;
      workbook.SheetNames.forEach((element) => {
        const wsname = element; // 取第一张表
        const ws = utils.sheet_to_json(workbook.Sheets[wsname]); // 生成json表格内容

        // 编辑数据
        for (let i = 0; i < ws.length; i++) {
          const item = ws[i];
          list.push(item);
          index++;
        }
      });
      onload(onloadCallback({ code, message, list }));
    } catch (e) {
      code = 99;
      message = "解析数据失败：" + e;
      return { code, message, list };
    }
  };
  fileReader.readAsBinaryString(fileBlob);
  return { code, message, list };
};
