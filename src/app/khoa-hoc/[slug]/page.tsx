"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { courses, Course, CourseLesson } from "@/data/courses";

const tierLabels: Record<string, string> = { free: "Miễn phí", pro: "Pro", business: "Business" };

export default function CourseDetailPage() {
  const { slug } = useParams();
  const course = courses.find(c => c.slug === slug);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("course_progress_" + slug);
      if (saved) setCompleted(JSON.parse(saved));
    }
  }, [slug]);

  const saveProgress = (lessonId: string) => {
    const updated = Array.from(new Set([...completed, lessonId]));
    setCompleted(updated);
    if (typeof window !== "undefined") localStorage.setItem("course_progress_" + slug, JSON.stringify(updated));
  };

  if (!course) return <div className="min-h-screen bg-gray-50/30 flex flex-col items-center justify-center"><h1 className="text-2xl font-bold mb-4">Không tìm thấy khóa học</h1><Link href="/khoa-hoc" className="text-primary-600 hover:underline">← Về danh sách khóa học</Link></div>;

  const lesson = course.lessons[currentLesson];
  const progress = Math.round((completed.length / course.lessons.length) * 100);

  const checkQuiz = () => {
    setSubmitted(true);
    const allCorrect = lesson.quiz?.every((q, i) => answers[`q${i}`] === q.correct);
    if (allCorrect) saveProgress(lesson.id);
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="bg-gray-900 text-white py-6">
        <div className="max-w-7xl mx-auto px-4">
          <Link href="/khoa-hoc" className="text-gray-400 hover:text-white text-sm mb-2 inline-block">← Quay lại khóa học</Link>
          <h1 className="font-display text-2xl font-bold">{course.title}</h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
            <span>{course.instructor}</span>
            <span>{course.level}</span>
            <span>{course.duration}</span>
            <span>★ {course.rating}</span>
          </div>
          <div className="mt-3 bg-gray-700 rounded-full h-2 overflow-hidden">
            <div className="bg-primary-500 h-full transition-all" style={{ width: progress + "%" }} />
          </div>
          <p className="text-xs text-gray-400 mt-1">{progress}% hoàn thành</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-4 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-3">Nội dung khóa học</h3>
              {course.lessons.map((l, i) => (
                <button key={l.id} onClick={() => { setCurrentLesson(i); setShowQuiz(false); setSubmitted(false); setAnswers({}); }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm mb-1 flex items-center gap-2 transition-colors ${
                    i === currentLesson ? "bg-primary-50 text-primary-700 font-medium" : "text-gray-600 hover:bg-gray-50"
                  }`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${completed.includes(l.id) ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}`}>
                    {completed.includes(l.id) ? "✓" : i + 1}
                  </span>
                  <span className="flex-1 line-clamp-1">{l.title}</span>
                  <span className="text-xs text-gray-400">{l.duration}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">{lesson.title}</h2>
              <p className="text-sm text-gray-400 mb-6">{lesson.duration}</p>

              {!showQuiz ? (
                <>
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: lesson.content }} />
                  <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                    {currentLesson > 0 && (
                      <button onClick={() => { setCurrentLesson(currentLesson - 1); setShowQuiz(false); setSubmitted(false); setAnswers({}); }}
                        className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium">← Bài trước</button>
                    )}
                    <div className="ml-auto flex gap-3">
                      {lesson.quiz && lesson.quiz.length > 0 && (
                        <button onClick={() => setShowQuiz(true)}
                          className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700">Làm bài kiểm tra</button>
                      )}
                      {currentLesson < course.lessons.length - 1 && (
                        <button onClick={() => { saveProgress(lesson.id); setCurrentLesson(currentLesson + 1); setShowQuiz(false); setSubmitted(false); setAnswers({}); }}
                          className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800">Bài tiếp theo →</button>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="font-bold text-lg text-gray-900 mb-4">Bài kiểm tra</h3>
                  {lesson.quiz?.map((q, qi) => (
                    <div key={qi} className="mb-6">
                      <p className="font-medium text-gray-900 mb-3">{qi + 1}. {q.question}</p>
                      <div className="space-y-2">
                        {q.options.map((opt, oi) => (
                          <button key={oi} onClick={() => !submitted && setAnswers({...answers, [`q${qi}`]: oi})}
                            className={`w-full text-left px-4 py-2.5 rounded-lg border transition-colors ${
                              submitted
                                ? oi === q.correct ? "border-green-500 bg-green-50 text-green-700" : answers[`q${qi}`] === oi ? "border-red-500 bg-red-50 text-red-700" : "border-gray-200"
                                : answers[`q${qi}`] === oi ? "border-primary-500 bg-primary-50" : "border-gray-200 hover:border-gray-300"
                            }`}>
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  {!submitted ? (
                    <button onClick={checkQuiz} disabled={Object.keys(answers).length < (lesson.quiz?.length || 0)}
                      className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 disabled:opacity-50">Nộp bài</button>
                  ) : (
                    <div className="flex items-center gap-4">
                      <p className={`font-medium ${lesson.quiz?.every((q, i) => answers[`q${i}`] === q.correct) ? "text-green-600" : "text-red-600"}`}>
                        {lesson.quiz?.every((q, i) => answers[`q${i}`] === q.correct) ? "Chính xác! Bạn đã hoàn thành bài học." : "Có câu sai. Hãy thử lại!"}
                      </p>
                      <button onClick={() => { setSubmitted(false); setAnswers({}); }} className="text-primary-600 hover:underline text-sm">Làm lại</button>
                      {currentLesson < course.lessons.length - 1 && (
                        <button onClick={() => { setCurrentLesson(currentLesson + 1); setShowQuiz(false); setSubmitted(false); setAnswers({}); }}
                          className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm">Bài tiếp →</button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
