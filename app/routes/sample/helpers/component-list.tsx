// app/routes/sample/helpers/display-data.tsx  (or wherever it lives)
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { DeleteForm } from "./component-form-delete";
import { EditButton } from "./component-input";
import type { Sample } from "./validation";

import { useState, useMemo, useEffect } from "react";

type SortConfig = {
  key: keyof Sample;
  direction: "asc" | "desc";
};

type DisplaySamplesProps = {
  samples: Sample[];
  setEditSample: (sample: Sample) => void;
  setIsModalOpen: (isModalOpen: boolean) => void;
};

export default function DisplaySamplesTable({
  samples,
  setEditSample,
  setIsModalOpen,
}: DisplaySamplesProps) {
  const handleEdit = (sample: Sample) => {
    setEditSample(sample);
    setIsModalOpen(true);
  };

  // ── SEARCH (FILTER) ──
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400); // smooth delay

    return () => clearTimeout(timer);
  }, [search]);

  const filteredData = useMemo(() => {
    if (!debouncedSearch.trim()) return samples;

    const term = debouncedSearch.toLowerCase();

    return samples.filter((s) =>
      [
        s.shareholder_id,
        s.name_english,
        s.name_amharic,
        s.primary_phone,
        s.national_id_num,
        s.tin_num,
        s.email,
      ]
        .filter(Boolean) // skip undefined/null
        .some((val) => String(val).toLowerCase().includes(term))
    );
  }, [samples, debouncedSearch]);

  // ── SORTING ──
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const handleSort = (key: keyof Sample) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return prev.direction === "asc"
          ? { key, direction: "desc" }
          : null; // toggle off
      }
      return { key, direction: "asc" };
    });
  };

  const sortedData = useMemo(() => {
    let data = [...filteredData];

    if (sortConfig) {
      data.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        if (aVal == null) aVal = "";
        if (bVal == null) bVal = "";

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return data;
  }, [filteredData, sortConfig]);

  // ── PAGINATION ──
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  return (
    <div className="rounded-md border overflow-x-auto">
      {/* Top Controls: Search + Pagination */}
      <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50 border-b">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by ID, name, phone, national ID, TIN, email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // reset to page 1 on new search
          }}
          className="w-full sm:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        {/* Pagination */}
        <div className="flex items-center gap-4 text-sm">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
          >
            Prev
          </button>

          <span className="font-medium">
            Page {page} of {totalPages || 1}
          </span>

          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
          >
            Next
          </button>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100">
            {/* Sortable headers */}
            <TableHead
              onClick={() => handleSort("shareholder_id")}
              className="cursor-pointer font-bold select-none"
            >
              Shareholder ID{" "}
              {sortConfig?.key === "shareholder_id"
                ? sortConfig.direction === "asc"
                  ? "↑"
                  : "↓"
                : ""}
            </TableHead>

            <TableHead
              onClick={() => handleSort("name_english")}
              className="cursor-pointer font-bold select-none"
            >
              Name (English){" "}
              {sortConfig?.key === "name_english"
                ? sortConfig.direction === "asc"
                  ? "↑"
                  : "↓"
                : ""}
            </TableHead>

            <TableHead>Gender</TableHead>
            <TableHead>Nationality</TableHead>
            <TableHead>Birth Date (English)</TableHead>
            <TableHead>National ID No</TableHead>
            <TableHead>TIN No</TableHead>
            <TableHead>Residency Status</TableHead>
            <TableHead>Primary Phone</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Subscribed Share</TableHead>
            <TableHead>Receipt No</TableHead>

            <TableHead className="text-right font-bold">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {paginatedData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={12} className="text-center py-12 text-gray-500 text-lg">
                No shareholders found
              </TableCell>
            </TableRow>
          ) : (
            paginatedData.map((sample) => (
              <TableRow key={sample.shareholder_id} className="hover:bg-gray-50 transition">
                <TableCell className="font-medium">{sample.shareholder_id}</TableCell>
                <TableCell>{sample.name_english}</TableCell>
                <TableCell>{sample.gender}</TableCell>
                <TableCell>{sample.nationality}</TableCell>
                <TableCell>{sample.birth_date_english}</TableCell>
                <TableCell>{sample.national_id_num}</TableCell>
                <TableCell>{sample.tin_num}</TableCell>
                <TableCell>{sample.residency_status}</TableCell>
                <TableCell>{sample.primary_phone}</TableCell>
                <TableCell>{sample.email}</TableCell>
                <TableCell>{sample.subscribed_share}</TableCell>
                <TableCell>{sample.receipt_num}</TableCell>

                <TableCell className="text-right flex justify-end gap-3">
                  <EditButton sample={sample} handleEdit={handleEdit} />
                  <DeleteForm shareholder_id={sample.shareholder_id} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
