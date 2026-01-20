"use client";
//testing firebase firestore :)

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, serverTimestamp, updateDoc, doc, increment } from "firebase/firestore";

export default function TestFirestore() {
  const [courseName, setCourseName] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCourses = async () => {
    const querySnapshot = await getDocs(collection(db, "courses"));
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setCourses(data.sort((a, b) => b.vouches - a.vouches));
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (!courseName) return;
    setLoading(true);
    try {
      await addDoc(collection(db, "courses"), {
        name: courseName.toUpperCase(),
        vouches: 0,
        createdAt: serverTimestamp(),
        status: "Pending"
      });
      setCourseName("");
      fetchCourses();
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleVouch = async (courseId) => {
    const courseRef = doc(db, "courses", courseId);
    await updateDoc(courseRef, {
      vouches: increment(1)
    });
    fetchCourses();
  };

  return (
    <div className="min-h-screen bg-[#fcfcf9] text-zinc-900 py-16 px-6">
      <div className="max-w-xl mx-auto">
        
        <header className="mb-12">
          <div className="flex items-baseline gap-2">
            <h1 className="text-5xl font-black tracking-tighter italic">
              WERELAYSYLLABUS
            </h1>
            <div className="h-2 w-2 bg-indigo-600 rounded-full animate-pulse" />
          </div>
          <p className="text-zinc-500 font-medium mt-1">Syllabus Registry / Firestore Test</p>
        </header>

        <section className="mb-12 group">
          <form onSubmit={handleAddCourse} className="relative">
            <input
              type="text"
              placeholder="Enter course code (eg CS101)"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="w-full pl-0 pr-24 py-4 bg-transparent border-b-2 border-zinc-200 focus:border-indigo-600 outline-none transition-all text-xl font-semibold placeholder:text-zinc-300"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-0 bottom-3 bg-zinc-900 hover:bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-bold tracking-wide transition-all active:translate-y-0.5 disabled:opacity-30"
            >
              {loading ? "..." : "ADD RELAY"}
            </button>
          </form>
        </section>

        <div className="space-y-6">
          <div className="flex justify-between items-end border-b border-zinc-100 pb-2">
            <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400">Current Directory</h2>
            <span className="text-[10px] font-bold bg-zinc-100 px-2 py-0.5 rounded">
              {courses.length} RECORDS
            </span>
          </div>

          {courses.length === 0 && !loading && (
            <div className="py-20 text-center opacity-40">
              <p className="font-mono text-sm">Waiting for incoming data...</p>
            </div>
          )}

          <div className="grid gap-3">
            {courses.map((course) => (
              <div 
                key={course.id} 
                className="group relative bg-white border border-zinc-200 p-5 rounded-xl hover:border-zinc-900 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] transition-all flex justify-between items-center"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-lg tracking-tight">{course.name}</h3>
                    {course.vouches >= 3 ? (
                      <span className="bg-emerald-50 text-emerald-700 text-[9px] px-2 py-0.5 rounded-full font-black uppercase">Verified</span>
                    ) : (
                      <span className="bg-orange-50 text-orange-700 text-[9px] px-2 py-0.5 rounded-full font-black uppercase">Pending</span>
                    )}
                  </div>
                  <p className="text-[10px] text-zinc-400 font-mono mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    REF_{course.id.toUpperCase()}
                  </p>
                </div>

                <button 
                  onClick={() => handleVouch(course.id)}
                  className="flex items-center gap-3 bg-zinc-50 hover:bg-zinc-900 hover:text-white px-4 py-2 rounded-lg border border-zinc-200 transition-all active:scale-90"
                >
                  <span className="text-sm font-black tracking-tighter">{course.vouches || 0}</span>
                  <span className="text-lg leading-none mt-[-2px]">🤝</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}