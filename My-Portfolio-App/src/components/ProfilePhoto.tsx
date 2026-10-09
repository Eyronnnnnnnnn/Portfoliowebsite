import profilePhoto from "../assets/photos/profile.png";

// Photos are stored as regular Git files; Vite emits the portrait as an image asset.

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
