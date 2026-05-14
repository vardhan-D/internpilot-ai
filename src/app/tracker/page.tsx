
"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

type Application = {
  id: string;
  company: string;
  role: string;
  status: string;
  link?: string | null;
  deadline?: string | null;
  notes?: string | null;
  createdAt: string;
};

type ApplicationForm = {
  company: string;
  role: string;
  status: string;
  link: string;
  deadline: string;
  notes: string;
};

const emptyForm: ApplicationForm = {
  company: "",
  role: "",
  status: "Saved",
  link: "",
  deadline: "",
  notes: "",
};

export default function TrackerPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<ApplicationForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function fetchApplications() {
    try {
      const response = await fetch("/api/applications");
      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to fetch applications.");
        return;
      }

      setApplications(data.applications);
    } catch (error) {
      console.error(error);
      alert("Something went wrong while fetching applications.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchApplications();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.company || !form.role || !form.status) {
      alert("Company, role, and status are required.");
      return;
    }

    try {
      setSaving(true);

      const url = editingId
        ? `/api/applications/${editingId}`
        : "/api/applications";

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to save application.");
        return;
      }

      setForm(emptyForm);
      setEditingId(null);

      await fetchApplications();
    } catch (error) {
      console.error(error);
      alert("Something went wrong while saving application.");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(application: Application) {
    setEditingId(application.id);

    setForm({
      company: application.company,
      role: application.role,
      status: application.status,
      link: application.link || "",
      deadline: application.deadline
        ? new Date(application.deadline).toISOString().split("T")[0]
        : "",
      notes: application.notes || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleCancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleDelete(id: string) {
    const confirmDelete = confirm("Delete this application?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to delete application.");
        return;
      }

      setApplications((prev) => prev.filter((item) => item.id !== id));

      if (editingId === id) {
        handleCancelEdit();
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong while deleting application.");
    }
  }

  return (
    <>
      <Navbar />
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <section className="mx-auto max-w-6xl">
        <div>
          <h1 className="text-3xl font-bold">Internship Tracker</h1>
          <p className="mt-2 text-slate-400">
            Track companies, roles, deadlines, status, links, and notes.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 grid gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 md:grid-cols-2"
        >
          <div className="md:col-span-2">
            <h2 className="text-xl font-bold">
              {editingId ? "Edit Application" : "Add New Application"}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              {editingId
                ? "Update your saved internship application."
                : "Add a new internship opportunity to your tracker."}
            </p>
          </div>

          <div>
            <label className="text-sm text-slate-300">Company *</label>
            <input
              value={form.company}
              onChange={(e) =>
                setForm({ ...form, company: e.target.value })
              }
              placeholder="Example: Microsoft"
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-slate-400"
            />
          </div>

          <div>
            <label className="text-sm text-slate-300">Role *</label>
            <input
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              placeholder="Example: Software Intern"
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-slate-400"
            />
          </div>

          <div>
            <label className="text-sm text-slate-300">Status *</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-slate-400"
            >
              <option>Saved</option>
              <option>Applied</option>
              <option>Interview</option>
              <option>Rejected</option>
              <option>Selected</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-slate-300">Deadline</label>
            <input
              type="date"
              value={form.deadline}
              onChange={(e) =>
                setForm({ ...form, deadline: e.target.value })
              }
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-slate-400"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-slate-300">Application Link</label>
            <input
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              placeholder="https://careers.company.com/job"
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-slate-400"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-slate-300">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Referral needed, follow-up date, requirements, etc."
              rows={4}
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-slate-400"
            />
          </div>

          <div className="flex gap-3 md:col-span-2">
            <button
              disabled={saving}
              className="rounded-xl bg-white px-5 py-3 font-semibold text-slate-950 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Application"
                : "Add Application"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="rounded-xl border border-slate-700 px-5 py-3 font-semibold text-white hover:bg-slate-800"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="mt-8">
          <h2 className="text-2xl font-bold">Saved Applications</h2>

          {loading ? (
            <p className="mt-4 text-slate-400">Loading applications...</p>
          ) : applications.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-slate-300">
                No applications added yet. Add your first one above.
              </p>
            </div>
          ) : (
            <div className="mt-4 grid gap-4">
              {applications.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-xl font-bold">{item.company}</h3>
                      <p className="mt-1 text-slate-300">{item.role}</p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full bg-slate-950 px-3 py-1 text-sm text-slate-300">
                          {item.status}
                        </span>

                        {item.deadline && (
                          <span className="rounded-full bg-slate-950 px-3 py-1 text-sm text-slate-300">
                            Deadline:{" "}
                            {new Date(item.deadline).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          className="mt-3 inline-block text-sm text-blue-400 hover:underline"
                        >
                          Open application link
                        </a>
                      )}

                      {item.notes && (
                        <p className="mt-3 text-sm text-slate-400">
                          {item.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(item)}
                        className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="rounded-xl border border-red-900 px-4 py-2 text-sm text-red-300 hover:bg-red-950"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
    </>
  );
}