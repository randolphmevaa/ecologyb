import { useState, useEffect } from "react";
// Import your Button component or use a simple button
import { Button } from "@/components/ui/Button"; // adjust path as needed
import { Dossier } from "./InfoTab";

// Define a type for a single comment
interface Comment {
  _id: string;
  commentaire: string;
  date: string;
  auteur: string;
  // Add any other fields as needed
}

interface CommentsSectionProps {
  dossier: Dossier;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ dossier }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentInput, setCommentInput] = useState("");

  useEffect(() => {
    if (dossier?.numero) {
      fetch(`/api/commentaires?linkedTo=${dossier.numero}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch comments");
          return res.json();
        })
        .then((data: Comment[]) => {
          setComments(data);
        })
        .catch((err) => {
          console.error("Error fetching comments:", err);
        });
    }
  }, [dossier]);

  const addComment = async () => {
    if (!commentInput.trim() || !dossier?.numero) return;

    const newComment = {
      commentaire: commentInput,
      auteur: "Current User", // Replace with actual user data if available.
      date: new Date().toLocaleString("fr-FR"),
      linkedTo: dossier.numero,
    };

    try {
      const res = await fetch("/api/commentaires", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newComment),
      });
      if (!res.ok) {
        console.error("Failed to add comment");
        return;
      }
      const savedComment: Comment = await res.json();
      setComments([...comments, savedComment]);
      setCommentInput("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700">
        Commentaires
      </label>
      <div className="border border-gray-300 rounded-lg p-4 h-40 overflow-y-auto bg-blue-50">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="mb-2">
              <div className="bg-white rounded-lg p-2 shadow-sm">
                <p className="text-sm text-gray-800">{comment.commentaire}</p>
                <span className="block text-xs text-gray-500 text-right">
                  {comment.date}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center text-sm">
            Aucun commentaire pour le moment.
          </p>
        )}
      </div>
      <div className="mt-2 flex">
        <input
          type="text"
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          placeholder="Ajouter un commentaire..."
          className="flex-1 rounded-l-md border border-gray-300 bg-white shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <Button type="button" variant="primary" onClick={addComment}>
          Ajouter
        </Button>
      </div>
    </div>
  );
};

export default CommentsSection;
