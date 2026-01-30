export default function Loading() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff",
        zIndex: 9999,
      }}
    >
      <div className="loader" />
    </div>
  );
}
