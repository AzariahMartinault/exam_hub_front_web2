export default function Topbar({ title = "Exam Hub" }) {
  return (
    <header className="topbar">
      <h1>{title}</h1>
    </header>
  );
}