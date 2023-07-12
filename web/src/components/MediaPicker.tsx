"use client";

import { ChangeEvent, useState } from "react";

// DESAFIO: implementar upload de video e preview de vídeo

export function MediaPicker() {
  const [preview, setPreview] = useState<string | null>(null);

  function onFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.target;

    if (!files) {
      return;
    }

    const previewURL = URL.createObjectURL(files[0]);

    setPreview(previewURL);
  }
  return (
    <>
      <input type="file" id="media" className="invisible h-0 w-0" onChange={onFileSelected}
      accept="image/*"/>
      {preview && <img src={preview} alt="" className="aspect-video w-full object-cover rounded-lg"/>}
    </>
  );
}
