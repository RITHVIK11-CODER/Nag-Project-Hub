"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";

type Project = {
  id: string;
  title: string;
  description: string | null;
  live_url: string;
  github_url: string | null;
  category: string | null;
  image_url: string | null;
};

type Props = {
  project: Project;
  onClose: () => void;
  onUpdated: (project: Project) => void;
};

export default function EditProjectForm({
  project,
  onClose,
  onUpdated,
}: Props) {
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(
    project.description || ""
  );
  const [liveUrl, setLiveUrl] = useState(project.live_url);
  const [githubUrl, setGithubUrl] = useState(
    project.github_url || ""
  );
  const [category, setCategory] = useState(
    project.category || ""
  );

  const [image, setImage] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState(
    project.image_url
  );

  const [loading, setLoading] = useState(false);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    let imageUrl = currentImage;

    // Upload new image if selected
    if (image) {
      const fileExt = image.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } =
        await supabaseBrowser.storage
          .from("project-images")
          .upload(fileName, image);

      if (uploadError) {
        alert(
          "Image upload failed: " +
            uploadError.message
        );

        setLoading(false);
        return;
      }

      const { data } = supabaseBrowser.storage
        .from("project-images")
        .getPublicUrl(fileName);

      imageUrl = data.publicUrl;
    }

    const { data, error } = await supabaseBrowser
      .from("projects")
      .update({
        title,
        description,
        live_url: liveUrl,
        github_url: githubUrl || null,
        category: category || null,
        image_url: imageUrl,
      })
      .eq("id", project.id)
      .select()
      .single();

    setLoading(false);

    if (error) {
      alert(
        "Unable to update project: " +
          error.message
      );
      return;
    }

    onUpdated(data);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50">
      <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">
            Edit Project
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleUpdate}
          className="mt-6 space-y-5"
        >

          {/* Project Name */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Project Name
            </label>

            <input
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              required
              className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              rows={4}
              className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3"
            />
          </div>

          {/* Live URL */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Live Project URL
            </label>

            <input
              type="url"
              value={liveUrl}
              onChange={(e) =>
                setLiveUrl(e.target.value)
              }
              required
              className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3"
            />
          </div>

          {/* GitHub */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              GitHub URL
            </label>

            <input
              type="url"
              value={githubUrl}
              onChange={(e) =>
                setGithubUrl(e.target.value)
              }
              className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Category
            </label>

            <input
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3"
            />
          </div>

          {/* Current Image */}
          {currentImage && (
            <div>
              <p className="text-sm text-gray-300 mb-2">
                Current Screenshot
              </p>

              <img
                src={currentImage}
                alt={title}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}

          {/* New Image */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Replace Screenshot
            </label>

            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) =>
                setImage(
                  e.target.files?.[0] || null
                )
              }
              className="w-full text-sm text-gray-400"
            />

            {image && (
              <p className="text-sm text-gray-500 mt-2">
                New image: {image.name}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">

            <button
              type="submit"
              disabled={loading}
              className="bg-white text-black px-5 py-3 rounded-lg font-medium disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="border border-gray-700 px-5 py-3 rounded-lg"
            >
              Cancel
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}