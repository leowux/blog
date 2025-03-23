import { getAllTags } from "app/blog/utils";
import { Tag } from "./tag";

export function TagCloud() {
  const allTags = getAllTags();

  if (allTags.length === 0) {
    return null;
  }

  return (
    <div className="mt-16">
      <div className="flex flex-wrap">
        {allTags.map((tag) => (
          <Tag key={tag} tag={tag} />
        ))}
      </div>
    </div>
  );
}
