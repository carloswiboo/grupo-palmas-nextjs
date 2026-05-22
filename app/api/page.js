import { getApiDocs } from "@/lib/swagger";
import ReactSwagger from "../components/swagger";

export const metadata = {
  title: "Documentación de API",
  description: "Documentación de API para Suzuki Palmas API",
};

export default async function IndexPage() {
  const spec = await getApiDocs();
  return (
    <section className="container">
      <ReactSwagger spec={spec} />
    </section>
  );
}
