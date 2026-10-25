import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Sparkles,
  FileDown,
  Save,
  Menu,
  X,
  Edit,
  NotebookText,
  ChevronDown,
  FileText,
} from "lucide-react";
import { arrayMove } from "@dnd-kit/sortable";

import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import Dropdown, { DropdownItem } from "../components/ui/Dropdown";
import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import SelectField from "../components/ui/SelectField";
import ChapterSidebar from "../components/editor/ChapterSidebar";
import ChapterEditorTab from "../components/editor/ChapterEditorTab";
import BookDetailsTab from "../components/editor/BookDetailsTab";

const EditorPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("editor");
  const fileInputRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // AI Modal State
  const [isOutlineModalOpen, setIsOutlineModalOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [aiStyle, setAiStyle] = useState("Informative");
  const [isGenerating, setIsGenerating] = useState(false);

  // 1. Fetch Book Details
  useEffect(() => {
    const fetchBook = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(
          API_PATHS.BOOK.GET_BOOK_BY_ID(bookId)
        );

        const bookData = response.data?.book || response.data;
        setBook(bookData);

        if (bookData?.chapters && bookData.chapters.length > 0) {
          setSelectedChapterIndex(0);
        }
      } catch (error) {
        console.error("Fetch Book Error:", error);
        toast.error("Failed to load book details.");
        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    if (bookId) fetchBook();
  }, [bookId, navigate]);
  const handleBookChange = (e) => {
    const { name, value } = e.target;
    setBook((prev) => ({ ...prev, [name]: value }));
  };

  const handleChapterChange = (e) => {
    const { name, value } = e.target;
    setBook((prev) => {
      const updatedChapters = (prev.chapters || []).map((chap, idx) =>
        idx === selectedChapterIndex ? { ...chap, [name]: value } : chap
      );
      return { ...prev, chapters: updatedChapters };
    });
  };

  const handleAddChapter = () => {
    const chapters = book?.chapters || [];
    const newChapter = {
      title: `Chapter ${chapters.length + 1}`,
      content: "",
    };
    const updatedChapters = [...chapters, newChapter];
    setBook((prev) => ({ ...prev, chapters: updatedChapters }));
    setSelectedChapterIndex(updatedChapters.length - 1);
  };

  const handleDeleteChapter = (index) => {
    if (!book?.chapters || book.chapters.length <= 1) {
      toast.error("A book must have at least one chapter.");
      return;
    }

    const updatedChapters = book.chapters.filter((_, i) => i !== index);
    setBook((prev) => ({ ...prev, chapters: updatedChapters }));
    setSelectedChapterIndex((prevIndex) =>
      prevIndex >= index ? Math.max(0, prevIndex - 1) : prevIndex
    );
  };

  const handleReorderChapters = (oldIndex, newIndex) => {
    setBook((prev) => ({
      ...prev,
      chapters: arrayMove(prev.chapters, oldIndex, newIndex),
    }));
    setSelectedChapterIndex(newIndex);
  };

  // 2. Save Changes (PUT /books/:id)
  const handleSaveChanges = async (bookToSave = book, showToast = true) => {
    if (!bookToSave) return;
    setIsSaving(true);
    try {
      await axiosInstance.put(
        API_PATHS.BOOK.UPDATE_BOOK(bookId),
        bookToSave
      );
      if (showToast) {
        toast.success("Changes saved successfully!");
      }
    } catch (error) {
      console.error("Save Changes Error:", error);
      toast.error("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  // 3. Upload Cover (PUT /books/:id/cover ya POST /books/upload-cover)
  const handleCoverImageUpload = async (e) => {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }

    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("coverImage", file);
    setIsUploading(true);
    const toastId = toast.loading("Uploading cover image...");

    try {
      const uploadUrl =
        typeof API_PATHS.BOOK.UPLOAD_COVER === "function"
          ? API_PATHS.BOOK.UPLOAD_COVER(bookId)
          : API_PATHS.BOOK.UPLOAD_COVER;

      const response = await axiosInstance.put(uploadUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Cover Upload Response:", response.data);

      const updatedBookData = response.data.book || response.data;
      let rawCoverPath = updatedBookData.coverImage || "";

      const BACKEND_BASE_URL = "http://localhost:8000"; 

      const finalCoverUrl = rawCoverPath.startsWith("http")
        ? rawCoverPath
        : `${BACKEND_BASE_URL}${rawCoverPath}`;

      setBook((prev) => ({
        ...prev,
        ...updatedBookData,
        coverImage: finalCoverUrl,
      }));

      toast.dismiss(toastId);
      toast.success("Cover image updated successfully!");
    } catch (error) {
      console.error("Cover Upload Error:", error);
      toast.dismiss(toastId);
      toast.error(error.response?.data?.message || "Failed to upload cover image.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };


  // 4. Generate Chapter Content via AI & Auto-Save
  const handleGenerateChapterContent = async (index) => {
    const chapter = book?.chapters?.[index];

    if (!chapter || !chapter.title) {
      toast.error("Chapter title is required to generate content.");
      return;
    }

    setIsGenerating(index);

    try {
      const payload = {
        chapterTitle: chapter.title,
        chapterDescription: chapter.description || "",
        style: aiStyle || "Informative",
        bookTitle: book?.title || "",
      };

      // 1. AI API call
      const response = await axiosInstance.post(
        API_PATHS.AI.GENERATE_CHAPTER,
        payload
      );

      // 2. Response extraction
      const generatedContent =
        response.data?.content ||
        response.data?.data?.content ||
        response.data?.chapterContent ||
        (typeof response.data === "string" ? response.data : "");

      if (!generatedContent) {
        toast.error("AI returned empty content.");
        return;
      }

      // 3. Updated chapters aur updated book object banayein
      const updatedChapters = book.chapters.map((chap, idx) =>
        idx === index ? { ...chap, content: generatedContent } : chap
      );

      const updatedBook = {
        ...book,
        chapters: updatedChapters,
      };

      // 4. Local state update karein
      setBook(updatedBook);

      // 5. Database me save karein (handleSaveChanges ko call karke)
      await handleSaveChanges(updatedBook, false);

      toast.success(`Content for "${chapter.title}" generated & saved!`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to generate content.");
    } finally {
      setIsGenerating(null);
    }
  };

  // 5. Export PDF (GET /export/:id/pdf)
  const handleExportPDF = async () => {
    const toastId = toast.loading("Generating PDF...");
    try {
      const response = await axiosInstance.get(
        API_PATHS.EXPORT.PDF(bookId),
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${book.title || "book"}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.dismiss(toastId);
      toast.success("PDF export complete!");
    } catch (error) {
      console.error("PDF Export Error:", error);
      toast.dismiss(toastId);
      toast.error("Failed to export PDF.");
    }
  };

  // 6. Export DOCX (GET /export/:id/docx)
  const handleExportDoc = async () => {
    if (!bookId) {
      toast.error("Book ID missing hai!");
      return;
    }

    const exportUrl = API_PATHS.EXPORT.DOCX(bookId);
    const toastId = toast.loading("Generating Document...");

    try {
      const response = await axiosInstance.get(exportUrl, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${book?.title || "book"}.docx`);
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        link.remove();
        window.URL.revokeObjectURL(url);
      }, 100);

      toast.dismiss(toastId);
      toast.success("Document export complete!");
    } catch (error) {
      toast.dismiss(toastId);

      if (error.response?.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const parsed = JSON.parse(reader.result);
            toast.error(parsed.message || "Failed to export document.");
          } catch {
            toast.error("Failed to export document.");
          }
        };
        reader.readAsText(error.response.data);
      } else {
        toast.error(error.response?.data?.message || "Failed to export document.");
      }
    }
  };
  if (isLoading || !book) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-600 font-medium">Loading Editor...</p>
      </div>
    );
  }

  return (
    <div className="flex bg-slate-50 font-sans relative min-h-screen">
      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 flex md:hidden"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            aria-hidden="true"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white z-50">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-white"
                onClick={() => setIsSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <X className="text-white w-6 h-6" />
              </button>
            </div>
            <ChapterSidebar
              book={book}
              selectedChapterIndex={selectedChapterIndex}
              onSelectChapter={(index) => {
                setSelectedChapterIndex(index);
                setIsSidebarOpen(false);
              }}
              onAddChapter={handleAddChapter}
              onDeleteChapter={handleDeleteChapter}
              onGenerateChapterContent={handleGenerateChapterContent}
              isGenerating={isGenerating}
              onReorderChapters={handleReorderChapters}
            />
          </div>
          <div className="flex-shrink-0 w-14" aria-hidden="true" />
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0 sticky top-0 h-screen">
        <ChapterSidebar
          book={book}
          selectedChapterIndex={selectedChapterIndex}
          onSelectChapter={(index) => {
            setSelectedChapterIndex(index);
            setIsSidebarOpen(false);
          }}
          onAddChapter={handleAddChapter}
          onDeleteChapter={handleDeleteChapter}
          onGenerateChapterContent={handleGenerateChapterContent}
          isGenerating={isGenerating}
          onReorderChapters={handleReorderChapters}
        />
      </div>

      {/* Main Area */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 text-slate-500 hover:text-slate-800 rounded-md"
              aria-label="Open sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Navigation Tabs */}
            <div className="hidden sm:flex space-x-1 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab("editor")}
                className={`flex items-center justify-center py-2 px-4 text-sm font-medium rounded-md transition-colors duration-200 whitespace-nowrap ${activeTab === "editor"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
                  }`}
              >
                <Edit className="w-4 h-4 mr-2" />
                Editor
              </button>
              <button
                onClick={() => setActiveTab("details")}
                className={`flex items-center justify-center py-2 px-4 text-sm font-medium rounded-md transition-colors duration-200 whitespace-nowrap ${activeTab === "details"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
                  }`}
              >
                <NotebookText className="w-4 h-4 mr-2" />
                Book Details
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Dropdown
              trigger={
                <Button variant="secondary" icon={FileDown}>
                  Export
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              }
            >
              <DropdownItem onClick={handleExportPDF}>
                <FileText className="w-4 h-4 mr-2 text-slate-500" />
                Export as PDF
              </DropdownItem>
              <DropdownItem onClick={handleExportDoc}>
                <FileText className="w-4 h-4 mr-2 text-slate-500" />
                Export as Document
              </DropdownItem>
            </Dropdown>

            <Button
              onClick={() => handleSaveChanges()}
              isLoading={isSaving}
              icon={Save}
            >
              Save Changes
            </Button>
          </div>
        </header>

        {/* Tab Content Body */}
        <div className="w-full">
          {activeTab === "editor" ? (
            <ChapterEditorTab
              book={book}
              selectedChapterIndex={selectedChapterIndex}
              onChapterChange={handleChapterChange}
              onGenerateChapterContent={handleGenerateChapterContent}
              isGenerating={isGenerating}
            />
          ) : (
            <BookDetailsTab
              book={book}
              onBookChange={handleBookChange}
              onCoverUpload={handleCoverImageUpload}
              isUploading={isUploading}
              fileInputRef={fileInputRef}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default EditorPage;