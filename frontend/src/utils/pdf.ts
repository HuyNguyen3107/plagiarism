import { pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.mjs`;

type PDFContent = {
  [key: string]: string[];
};

type PDFContentInfo = {
  pageNumber: number;
  content: PDFContent;
  sortedKeys: string[];
};

const getPDFContent = (arr: any[]): string => {
  const arrContent: PDFContentInfo[] = [];
  arr.forEach((item) => {
    const objContent: PDFContent = {};
    const pageNumber: number = item.pageNumber;
    item.text.forEach((textItem: { str: string; transform: number[] }) => {
      const str: string = textItem.str;
      const position: string = textItem.transform[5] + "";
      if (!objContent[position]) {
        objContent[position] = [str];
      } else {
        objContent[position].push(str);
      }
    });
    const sortedKeys = Object.keys(objContent).sort((a, b) => {
      return parseFloat(b) - parseFloat(a);
    });

    arrContent.push({
      pageNumber: pageNumber,
      content: objContent,
      sortedKeys: sortedKeys,
    });
  });
  let result: string = "";
  arrContent.forEach((content) => {
    const objContent = content.content;
    content.sortedKeys.forEach((key) => {
      result += objContent[key].join("");
      result += "\n";
    });
  });
  return result;
};

const getInfoArrFromFile = async (file: File): Promise<any[]> => {
  const blobURL = URL.createObjectURL(file);
  const loadingTask = pdfjs.getDocument(blobURL);
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  const pdfContent = [];
  for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();
    const temp = {
      pageNumber: pageNumber,
      text: textContent.items,
    };
    pdfContent.push(temp);
  }
  return pdfContent;
};

const pdfUtil = {
  getPDFContent,
  getInfoArrFromFile,
};

export default pdfUtil;
