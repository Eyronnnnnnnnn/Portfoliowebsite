import profilePhoto from "../assets/photos/profile.png";

// Photos are stored as regular Git files; Vite emits the portrait as an image asset.

export default function ProfilePhoto() {
  return (
    <img
      src={profilePhoto}
      alt="Aaron D Guillermo"
      width={142}
      height={142}
      className="w-full h-full object-cover"
      fetchPriority="high"
      decoding="async"
    />
  );
}
