"use client";
import React from "react";
import { getMenuYfunciones } from "../../../lib/api/apiMenuYFunciones";
import CardMenuPermisosComponent from "@/app/components/CardMenuPermisosComponent/CardMenuPermisosComponent";

const MenuYFuncionesScreenComponent = () => {
  const [finalData, setFinalData] = React.useState([]);

  React.useEffect(() => {
    getMenuYfunciones().then((response) => {
      if (response.status === 200) {
        setFinalData(response.data);
      } else {
        setFinalData([]);
      }
    });
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        {finalData.map((item, index) => (
          <CardMenuPermisosComponent key={index} />
        ))}
      </div>
    </>
  );
};

export default MenuYFuncionesScreenComponent;
