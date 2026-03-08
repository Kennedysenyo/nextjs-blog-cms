import { CloudUpload, EyeOff, FilePen, FileText } from "lucide-react";
import { Card } from "./card";
import { fetchCardsData } from "@/features/posts/posts.queries";

export const CardGrid = async () => {
  const [allTotal, publishedTotal, draftsTotal, archivedTotal] =
    await fetchCardsData();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-4 mt-4">
      <Card
        figure={allTotal}
        title="All Posts"
        color="#1e3a8a"
        icon={FileText}
      />
      <Card
        figure={publishedTotal}
        title="Published"
        color="#28a745"
        icon={CloudUpload}
      />
      <Card
        figure={draftsTotal}
        title="Drafts"
        color="rgb(212, 165, 45)"
        icon={FilePen}
      />
      <Card
        figure={archivedTotal}
        title="Archived"
        color="#a226e9"
        icon={EyeOff}
      />
    </div>
  );
};
