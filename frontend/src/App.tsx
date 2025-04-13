import React, { useEffect, useState } from "react";
import axios from "axios";
import FileUpload from "./components/FileUpload";
import similarity from "similarity";
import pdfUtil from "./utils/pdf";
interface UploadedFile {
  id: number;
  name: string;
  path: string;
  createdAt: string;
  updatedAt: string;
}

const App: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async (): Promise<void> => {
    try {
      const response = await axios.get<UploadedFile[]>(
        "http://localhost:3000/files"
      );
      const data = response.data.map((file) => {
        file.path = `uploads\\pdf\\${response.data[0].name.replace(
          ".docx",
          ".pdf"
        )}`;
        file.name = file.name.replace(".docx", ".pdf");
        return file;
      });
      const url = `http://localhost:3000/${data[0].path}`;
      const res = await fetch(url);
      const blob = await res.blob();
      const file = new File([blob], data[0].name, {
        type: "application/pdf",
      });

      const pdfContent = await pdfUtil.getInfoArrFromFile(file);

      const temp: string = pdfUtil.getPDFContent(pdfContent);
      const other: string = pdfUtil.getPDFContent(pdfContent);
      const similarityScore = similarity(temp, other);
      console.log("Similarity Score:", similarityScore);

      setFiles(data);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  return (
    <div>
      <h1>File Upload System</h1>
      <FileUpload />
      <h2>Uploaded Files</h2>
      <ul>
        {files.map((file) => (
          <li key={file.id}>
            <a
              href={`http://localhost:3000/${file.path}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {file.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
