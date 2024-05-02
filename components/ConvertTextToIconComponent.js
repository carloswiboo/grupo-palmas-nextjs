import React from "react";
import * as SolidIcons from "@heroicons/react/24/solid";

const ConvertTextToIconComponent = (props) => {
  const { ...icons } = SolidIcons;

  console.log(icons);

  const IconComponent = icons[props.textIcon];
  // Verifica si el ícono es válido antes de renderizarlo
  if (!IconComponent) {
    return <div>Ícono no válido</div>;
  }
  return <IconComponent className={props.className} />;
};

export default ConvertTextToIconComponent;
