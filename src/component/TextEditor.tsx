"use client";

import { useEffect, useRef, useState } from "react";
import "quill/dist/quill.snow.css";
import Quill from "quill";

export default function TextEditor() {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [quillInstance, setQuillInstance] = useState<Quill | null>(null);

  useEffect(() => {
    if (editorRef.current && typeof window !== "undefined") {
      import("quill").then((QuillModule) => {
        const Quill = QuillModule.default;

        const quill = new Quill(editorRef.current as HTMLDivElement, {
          theme: "snow",
          modules: {
            toolbar: {
              container: [
                [{ header: [1, 2, false] }],
                ["bold", "italic", "underline"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["image", "code-block"],
              ],
            },
          },
        });

        setQuillInstance(quill);

        quill.getModule("toolbar").addHandler("image", () => handleImageUpload(quill));
      });
    }
  }, []);

  const handleImageUpload = (quill: Quill) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const imageURL = reader.result as string;
        const range = quill.getSelection();
        if (range) {
          quill.insertEmbed(range.index, "image", imageURL);
        }
      };
      reader.readAsDataURL(file);
    };
  };

  return <div ref={editorRef} className="h-64 bg-white"></div>;
}
