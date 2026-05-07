"use client";

import { FormEvent, useMemo, useState } from "react";
import { homepageContent } from "../data/homepageContent";
import { publicStudentLookupData } from "../data/publicStudentLookup";

export default function PublicStudentLookup() {
  const [studentQuery, setStudentQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");

  const lookupResult = useMemo(() => {
    const normalizedQuery = submittedQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return null;
    }

    return publicStudentLookupData.find((student) => {
      return (
        student.studentId.toLowerCase() === normalizedQuery ||
        student.name.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [submittedQuery]);

  const handleLookup = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmittedQuery(studentQuery);
  };

  return (
    <section id="lookup" className="surface-card rounded-3xl p-8 sm:p-10">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-5">
          <p className="text-sm font-bold uppercase tracking-widest text-green-700">
            Public student lookup
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-[#191c1d]">
            {homepageContent.publicLookup.title}
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#4c616c]">
            {homepageContent.publicLookup.description}
          </p>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <form
            className="flex flex-col gap-3 rounded-3xl border border-black/5 bg-[#f3f6f3] p-4 sm:flex-row sm:items-center"
            onSubmit={handleLookup}
          >
            <input
              className="w-full rounded-full border border-black/5 bg-white px-5 py-4 text-sm font-medium text-[#191c1d] placeholder:text-[#707a6c] focus:ring-2 focus:ring-green-700/20"
              placeholder="Enter Student ID (e.g. STU-2024)"
              type="text"
              value={studentQuery}
              onChange={(event) => setStudentQuery(event.target.value)}
            />
            <button
              className="rounded-full bg-[#176d25] px-6 py-4 font-bold text-white transition-colors hover:bg-[#12581e]"
              type="submit"
            >
              Lookup
            </button>
          </form>

          <div className="rounded-3xl border border-dashed border-green-700/30 bg-[#f7faf7] p-5">
            {!submittedQuery ? (
              <>
                <p className="text-sm font-bold text-[#191c1d]">
                  No result yet
                </p>
                <p className="mt-2 text-sm text-[#4c616c]">
                  Search a Student ID or student name to preview the public
                  lookup layout.
                </p>
              </>
            ) : lookupResult ? (
              <div className="space-y-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-green-700">
                      Match found
                    </p>
                    <h3 className="mt-2 text-2xl font-black text-[#191c1d]">
                      {lookupResult.name}
                    </h3>
                    <p className="mt-1 text-sm text-[#4c616c]">
                      {lookupResult.studentId} · {lookupResult.course}
                    </p>
                    <p className="mt-1 text-sm text-[#4c616c]">
                      {lookupResult.yearLevel} · {lookupResult.campus}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white px-4 py-3 text-right shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-widest text-[#4c616c]">
                      Status
                    </p>
                    <p className="mt-1 text-sm font-bold text-green-700">
                      {lookupResult.status === "active" ? "Active" : "Paused"}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    {
                      label: "Points",
                      value: lookupResult.points.toLocaleString(),
                    },
                    {
                      label: "Reports",
                      value: lookupResult.reports.toString(),
                    },
                    { label: "Rank", value: lookupResult.rank },
                  ].map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-2xl border border-black/5 bg-white p-4"
                    >
                      <p className="text-xs font-bold uppercase tracking-widest text-[#4c616c]">
                        {metric.label}
                      </p>
                      <p className="mt-2 text-2xl font-black text-green-700">
                        {metric.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-[#191c1d]">
                      Recent reports
                    </p>
                    <p className="text-xs text-[#4c616c]">
                      Last seen {lookupResult.lastSeen}
                    </p>
                  </div>

                  <div className="mt-3 space-y-2">
                    {lookupResult.recentReports.map((report) => (
                      <div
                        key={report.id}
                        className="flex items-center justify-between rounded-2xl bg-white px-4 py-3"
                      >
                        <div>
                          <p className="text-sm font-semibold text-[#191c1d]">
                            {report.title}
                          </p>
                          <p className="text-xs text-[#4c616c]">
                            Reference {report.id}
                          </p>
                        </div>
                        <span className="rounded-full bg-[#d9f6d4] px-3 py-1 text-xs font-bold text-[#0f4a16]">
                          +{report.points}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm font-bold text-[#191c1d]">
                  No student found
                </p>
                <p className="mt-2 text-sm text-[#4c616c]">
                  No mock record matched “{submittedQuery}”. Try STU-2024-0142
                  or Alyssa.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
