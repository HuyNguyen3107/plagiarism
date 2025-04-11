import React, { useEffect, useState } from "react";
import axios from "axios";
import FileUpload from "./components/FileUpload";
import { pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.mjs`;
// Define the type for a file object
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
      const blobURL = URL.createObjectURL(file);
      const loadingTask = pdfjs.getDocument(blobURL);
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;
      for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);
        const textContent = await page.getTextContent();
        console.log(textContent);
      }
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
