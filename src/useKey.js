import { useEffect } from "react";

export function useKEY(callback, key) {
  useEffect(() => {
    const handleKeydown = (event) => {
      if (event.code.toLowerCase() === key.toLowerCase()) {
        callback();
      }
    };

    window.addEventListener("keydown", handleKeydown);

    // Cleanup function to remove the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [callback, key]);
}
