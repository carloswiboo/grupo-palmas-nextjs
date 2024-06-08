"use client";

import { getBannersPrivateApi } from "@/lib/api/apiBanners";
import { useState, useEffect } from "react";

export default function Page({ params, searchParams }) {
  const [finalData, setFinalData] = useState([]);
  const [crud, setCrud] = useState({ type: null, data: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBannersPrivateApi().then((resultado) => {});
  }, [crud, loading]);

  return <h1>My Page</h1>;
}
