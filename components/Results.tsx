import { KBarResults, useMatches } from "kbar";

export default function Results({ darkMode }: { darkMode: boolean }) {
  const { results } = useMatches();
  return (
    <KBarResults
      maxHeight={500}
      items={results}
      onRender={({ item, active }) => (
        <div
          style={{
            padding: ".5rem 1rem",
            margin: "0.25rem",
            transition: "all 0.125s ease",
            ...(active
              ? {
                  borderRadius: "0.25rem",
                  backgroundColor: darkMode ? "rgb(0, 30, 60)" : "#eee",
                  border: "1px solid rgb(30, 60, 90)",
                  fontWeight: "bold",
                }
              : {
                  border: "1px solid transparent",
                }),
          }}
        >
          <span>{typeof item === "string" ? item : item.name}</span>
        </div>
      )}
    />
  );
}
