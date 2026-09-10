/** Computes the SHA-256 hash of an ArrayBuffer */
export const computeHash = async (buffer: ArrayBuffer) => {
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};
