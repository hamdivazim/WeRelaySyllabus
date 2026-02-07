import { useState, useEffect, useCallback } from "react";
import { db } from "@/lib/firebase";
import { 
  collection, getDocs, query, orderBy, getDoc, 
  addDoc, updateDoc, deleteDoc, Timestamp, doc, arrayUnion, arrayRemove, serverTimestamp 
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

const INITIAL_EVENT_STATE = {
  title: "", description: "", location: "", type: "", colour: "#6366f1", startTime: "12:00", endTime: ""
};

export function useCourseData(courseId = null) {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(!!courseId);
  const [isSaving, setIsSaving] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [newEvent, setNewEvent] = useState(INITIAL_EVENT_STATE);

  const fetchData = useCallback(async () => {
    if (!courseId) return;
    setLoading(true);
    try {
      const courseSnap = await getDoc(doc(db, "courses", courseId));
      if (courseSnap.exists()) setCourseData(courseSnap.data());

      const eventsCol = collection(db, "courses", courseId, "events");
      const snaps = await getDocs(query(eventsCol, orderBy("start")));
      
      const mapped = snaps.docs.map(d => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          start: data.start?.toDate ? data.start.toDate() : new Date(data.start),
          end: data.end?.toDate ? data.end.toDate() : data.end ? new Date(data.end) : null
        };
      });
      setEvents(mapped);
    } catch (err) {
      console.error("Data fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const resetCourseVouches = async () => {
    if (!courseId) return;
    const courseRef = doc(db, "courses", courseId);
    await updateDoc(courseRef, { vouched: [] });
  };

  const createCourse = async (formData) => {
    setIsSaving(true);
    try {
      const docRef = await addDoc(collection(db, "courses"), {
        university: formData.university,
        name: formData.name,
        code: formData.code,
        description: formData.description,
        createdAt: serverTimestamp(),
        vouched: []
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating course:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const updateCourseDetails = async (updates) => {
    if (!courseId) return;
    setIsSaving(true);
    try {
      const courseRef = doc(db, "courses", courseId);
      await updateDoc(courseRef, { 
        ...updates, 
        vouched: [] 
      });
      await fetchData(); 
    } catch (error) {
      console.error("Error updating course:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const saveEvent = async (selectedDay, onSuccess) => {
    if (!courseId || isSaving) return;
    setIsSaving(true);
    try {
      const dayDate = new Date(selectedDay);
      const [sh, sm] = newEvent.startTime.split(":");
      const startT = new Date(new Date(dayDate).setHours(parseInt(sh), parseInt(sm)));
      let endT = null;
      if (newEvent.endTime) {
        const [eh, em] = newEvent.endTime.split(":");
        endT = new Date(new Date(dayDate).setHours(parseInt(eh), parseInt(em)));
      }
      const payload = {
        ...newEvent,
        start: Timestamp.fromDate(startT),
        end: endT ? Timestamp.fromDate(endT) : null
      };

      if (editingEventId) {
        await updateDoc(doc(db, "courses", courseId, "events", editingEventId), payload);
      } else {
        await addDoc(collection(db, "courses", courseId, "events"), payload);
      }
      
      await resetCourseVouches();
      setNewEvent(INITIAL_EVENT_STATE);
      setEditingEventId(null);
      await fetchData();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteEvent = async () => {
    if (!editingEventId) return;
    try {
      await deleteDoc(doc(db, "courses", courseId, "events", editingEventId));
      await resetCourseVouches();
      setNewEvent(INITIAL_EVENT_STATE);
      setEditingEventId(null);
      await fetchData();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const startEditing = (ev) => {
    setEditingEventId(ev.id);
    setNewEvent({
      title: ev.title || "",
      description: ev.description || "",
      location: ev.location || "",
      type: ev.type || "",
      colour: ev.colour || "#6366f1",
      startTime: ev.start.toTimeString().slice(0, 5),
      endTime: ev.end ? ev.end.toTimeString().slice(0, 5) : ""
    });
  };

  const downloadICS = (courseName) => {
    if (!events.length) return;
    const formatDate = (d) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    let content = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Werelay//Syllabus//EN\n";
    events.forEach(ev => {
      content += `BEGIN:VEVENT\nUID:${ev.id}\nDTSTAMP:${formatDate(new Date())}\nDTSTART:${formatDate(ev.start)}\n`;
      if (ev.end) content += `DTEND:${formatDate(ev.end)}\n`;
      content += `SUMMARY:${ev.title}\nDESCRIPTION:${(ev.description || "").replace(/\n/g, "\\n")}\nLOCATION:${ev.location || ""}\nEND:VEVENT\n`;
    });
    content += "END:VCALENDAR";
    const blob = new Blob([content], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${courseName || 'course'}.ics`;
    link.click();
  };

  const handleVouch = async () => {
    if (!user || !courseId) return;
    const hasVouched = courseData?.vouched?.includes(user.uid);
    if (hasVouched) return;
    try {
      const courseRef = doc(db, "courses", courseId);
      await updateDoc(courseRef, { vouched: arrayUnion(user.uid) });
      await fetchData();
    } catch (err) {
      console.error("Error vouching:", err);
    }
  };

  const saveToProfile = async () => {
    if (!user || !courseId) return;
    setIsSaving(true);
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        savedCourses: arrayUnion(courseId)
      });
      return true;
    } catch (error) {
      console.error("Error saving to profile:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const removeFromProfile = async () => {
    if (!user || !courseId) return;
    setIsSaving(true);
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        savedCourses: arrayRemove(courseId)
      });
      return true;
    } catch (error) {
      console.error("Error removing from profile:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    events, courseData, loading, isSaving, editingEventId, newEvent,
    setNewEvent, saveEvent, deleteEvent, startEditing, handleVouch,
    createCourse, updateCourseDetails, saveToProfile, removeFromProfile,
    resetForm: () => { setNewEvent(INITIAL_EVENT_STATE); setEditingEventId(null); },
    downloadICS
  };
}