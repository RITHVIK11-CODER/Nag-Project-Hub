
"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function AddProjectForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      let imageUrl: string | null = null;

      // Upload image
      if (image) {
        const fileExt = image.name.split(".").pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError } =
          await supabaseBrowser.storage
            .from("project-images")
            .upload(fileName, image);

        if (uploadError) {
          throw new Error(uploadError.message);
        }

        const { data } = supabaseBrowser.storage
          .from("project-images")
          .getPublicUrl(fileName);

        imageUrl = data.publicUrl;
      }

      // Create project
      const { error } = await supabaseBrowser
        .from("projects")
        .insert({
          title,
          description,
          live_url: liveUrl,
          github_url: githubUrl || null,
          category: category || null,
          image_url: imageUrl,
        });

      if (error) {
        throw new Error(error.message);
      }

      setTitle("");
      setDescription("");
      setLiveUrl("");
      setGithubUrl("");
      setCategory("");
      setImage(null);

      const fileInput = document.getElementById(
        "project-image"
      ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = "";
      }

      setMessage("Project added successfully! 🎉");

      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >

      {/* TITLE */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Project Title
        </label>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Sreenidhians Hub"
          required
          className="admin-input"
        />
      </div>

      {/* CATEGORY */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Category
        </label>

        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g. Web App, AI, Hackathon"
          className="admin-input"
        />

        <p className="mt-2 text-xs text-slate-600">
          This will automatically become a homepage filter.
        </p>
      </div>

      {/* DESCRIPTION */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Description
        </label>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Briefly describe what you built..."
          rows={5}
          className="admin-input resize-none"
        />
      </div>

      {/* LIVE URL */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Live Website URL
        </label>

        <input
          type="url"
          value={liveUrl}
          onChange={(e) => setLiveUrl(e.target.value)}
          placeholder="https://your-project.vercel.app"
          required
          className="admin-input"
        />
      </div>

      {/* GITHUB */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          GitHub URL
          <span className="ml-2 text-xs text-slate-600">
            Optional
          </span>
        </label>

        <input
          type="url"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
          placeholder="https://github.com/username/project"
          className="admin-input"
        />
      </div>

      {/* IMAGE */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Project Screenshot
        </label>

        <label
          htmlFor="project-image"
          className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-blue-400/25 bg-blue-500/5 px-5 text-center transition hover:border-blue-400/50 hover:bg-blue-500/10"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-2xl text-blue-300">
            ↑
          </div>

          <p className="mt-3 text-sm font-medium text-slate-300">
            {image
              ? image.name
              : "Tap to choose project screenshot"}
          </p>

          <p className="mt-1 text-xs text-slate-600">
            JPG, PNG or WebP
          </p>
        </label>

        <input
          id="project-image"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(e) =>
            setImage(e.target.files?.[0] || null)
          }
          className="hidden"
        />
      </div>

      {/* MESSAGE */}
      {message && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            message.includes("successfully")
              ? "border-blue-400/20 bg-blue-500/10 text-blue-300"
              : "border-red-500/20 bg-red-500/10 text-red-300"
          }`}
        >
          {message}
        </div>
      )}

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-blue-500 px-5 py-4 text-sm font-semibold text-white shadow-[0_0_35px_rgba(59,130,246,0.18)] transition hover:bg-blue-400 hover:shadow-[0_0_55px_rgba(59,130,246,0.3)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Uploading Project..." : "Publish Project →"}
      </button>

    </form>
  );
}
