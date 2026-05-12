export default function UploadResumePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <section className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold">Upload Resume</h1>
        <p className="mt-2 text-slate-400">
          Upload your PDF resume. AI analysis will be added in the next step.
        </p>

        <div className="mt-8 rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-8">
          <label className="block text-sm font-medium text-slate-300">
            Resume PDF
          </label>

          <input
            type="file"
            accept=".pdf"
            className="mt-4 block w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-slate-300"
          />

          <button className="mt-6 rounded-xl bg-white px-5 py-3 font-semibold text-slate-950 hover:bg-slate-200">
            Analyze Resume
          </button>
        </div>
      </section>
    </main>
  );
}