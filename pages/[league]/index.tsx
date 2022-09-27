import BasePage from "@/components/Grid/Base";

export default function Home(): React.ReactElement {
  return (
    <>
      <BasePage
        pageTitle="Form Guide"
        getValue={(match) => match.result ?? "-"}
      />
    </>
  );
}
