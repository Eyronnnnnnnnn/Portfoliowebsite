import profilePhoto from "../assets/photos/profile.png?inline";

// Keep the portrait in the image element and bundle its bytes with the app.
// This avoids preview asset-path failures and a sticky initials-only error state.
export default function ProfilePhoto() {
  return (
    <img
      src={profilePhoto}
      alt="Aaron D Guillermo"
      width={112}
      height={112}
      className="w-full h-full object-cover"
      fetchPriority="high"
      decoding="async"
    />
  );
}
