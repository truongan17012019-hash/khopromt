"use client";
import { courses } from "@/data/courses";

const tierColors: Record<string, string> = { free: "bg-green-500/20 text-green-400", pro: "bg-blue-500/20 text-blue-400", business: "bg-purple-500/20 text-purple-400" };
const tierLabels: Record<string, string> = { free: "Miễn phí", pro: "Pro", business: "Business" };

export default function AdminCoursesPage() {
  const totalStudents = courses.reduce((s, c) => s + c.students, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Quản lý Khóa học</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-gray-400 text-sm">Tổng khóa học</p>
          <p className="text-2xl font-bold text-white">{courses.length}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-gray-400 text-sm">Tổng học viên</p>
          <p className="text-2xl font-bold text-white">{totalStudents.toLocaleString()}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-gray-400 text-sm">Khóa miễn phí</p>
          <p className="text-2xl font-bold text-green-400">{courses.filter(c => c.tier === "free").length}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-gray-400 text-sm">Khóa trả phí</p>
          <p className="text-2xl font-bold text-blue-400">{courses.filter(c => c.tier !== "free").length}</p>
        </div>
      </div>
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-gray-700">
            <th className="text-left px-4 py-3 text-gray-400 text-sm">Khóa học</th>
            <th className="text-left px-4 py-3 text-gray-400 text-sm">Gói</th>
            <th className="text-left px-4 py-3 text-gray-400 text-sm">Level</th>
            <th className="text-left px-4 py-3 text-gray-400 text-sm">Học viên</th>
            <th className="text-left px-4 py-3 text-gray-400 text-sm">Rating</th>
            <th className="text-left px-4 py-3 text-gray-400 text-sm">Số bài</th>
          </tr></thead>
          <tbody>
            {courses.map(c => (
              <tr key={c.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                <td className="px-4 py-3 text-white font-medium">{c.title}</td>
                <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${tierColors[c.tier]}`}>{tierLabels[c.tier]}</span></td>
                <td className="px-4 py-3 text-gray-300 text-sm">{c.level}</td>
                <td className="px-4 py-3 text-gray-300 text-sm">{c.students.toLocaleString()}</td>
                <td className="px-4 py-3 text-yellow-400 text-sm">★ {c.rating}</td>
                <td className="px-4 py-3 text-gray-300 text-sm">{c.lessons.length} bài</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
