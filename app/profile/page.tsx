'use client';

import { useState } from 'react';

// allow profile pictures to be upload-able

export default function ProfilePage() {
  const [preview, setPreview] = useState('/images/mario.jpeg');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('image', selectedFile);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      alert('Image uploaded successfully');
      // how to refetch user data here?
    } else {
      alert('Image upload failed');
    }
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-10">
        {/* Profile Picture Section */}
        <section>
          <h2 className="text-lg font-semibold mb-2">Profile Picture</h2>
          <div className="flex items-center gap-6">
            <img
              src={preview}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border"
            />
            <div>
              <label className="inline-block cursor-pointer bg-gray-200 text-gray-800 px-6 py-3 rounded hover:bg-gray-300 text-sm">
                Choose file
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
              <button
                type="submit"
                className="block mt-2 px-6 py-3 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                Upload Image
              </button>
            </div>
          </div>
        </section>

        {/* Display Name Section */}
        <section>
          <h2 className="text-lg font-semibold mb-2">Display Name</h2>
          <div className="flex flex-col gap-2 w-64">
            <input
              type="text"
              defaultValue="YourUsername"
              className="border rounded px-3 py-2 text-black"
            />
            <button
              type="button"
              className="mt-1 px-4 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 self-start"
              onClick={() => alert('Name saved (mock behavior)')}
            >
              Save Name
            </button>
          </div>
        </section>
      </form>

      <p className="text-gray-600">More profile details and customization coming soon.</p>
    </main>
  );
}
