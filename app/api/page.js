import { getApiDocs } from "@/lib/swagger";
import { Metadata } from "next";
import ReactSwagger from "../components/swagger";

export const metadata = {
  title: "API Docs",
  description: "API Documentation with Swagger for Nextjs",
};

export default async function IndexPage() {
  const spec = await getApiDocs();
  return (
    <section className="container">
      <ReactSwagger spec={spec} />
    </section>
  );
}
