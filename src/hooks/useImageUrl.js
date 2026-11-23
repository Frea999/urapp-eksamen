import { useEffect, useState } from "react";
import { downloadBackground } from "../images";

export default function useImageUrl(path) {
  const [loaded, setLoaded] = useState({ path: null, url: null });

  useEffect(() => {
    if (!path) return;
    let cancelled = false;
    let objectUrl = null;

    downloadBackground(path)
      .then((blob) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setLoaded({ path, url: objectUrl });
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [path]);

  return loaded.path === path ? loaded.url : null;
}
