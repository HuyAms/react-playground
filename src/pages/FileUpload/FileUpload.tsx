import {useState} from 'react';

export function FileUploadPage() {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    console.log('FIle changes: ', e.target.files);
  };

  return (
    <div>
      <h1>File upload</h1>
      <input onChange={handleFileChange} multiple type="file" accept="image/*" />
    </div>
  );
}
