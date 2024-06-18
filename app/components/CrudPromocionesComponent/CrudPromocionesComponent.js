"use client";
import { data } from "autoprefixer";
import React from "react";
import * as yup from "yup";
import { useFormik } from "formik";

const validationSchema = yup.object({
  urlImagen: yup.string("Ingresa").required("Requerido"),
  urlDestino: yup.string("Ingresa").required("Requerido"),
  fechaInicio: yup.string("Ingresa").required("Requerido"),
  fechaFin: yup.string("Ingresa").required("Requerido"),
});

const CrudPromocionesComponent = ({ crud, setCrud, titulo }) => {
  const [isDisabled, setIsDisabled] = React.useState(false);

  const escFunction = (event) => {
    if (event.keyCode === 27) {
      setCrud({ type: null, data: null });
    }
  };

  React.useEffect(() => {
    document.addEventListener("keydown", escFunction, false);
    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, []);

  const formik = useFormik({
    initialValues: {
      urlImagen: crud.type !== "create" ? crud.data.urlImagen : "",
      urlDestino: crud.type !== "create" ? crud.data.urlDestino : "",
      fechaInicio: crud.type !== "create" ? crud.data.fechaInicio : "",
      fechaFin: crud.type !== "create" ? crud.data.fechaFin : "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      debugger;
      setIsDisabled(true);
    },
  });

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-end z-50">
        <div
          className="fixed inset-0 bg-black opacity-50"
          onClick={() => setCrud({ type: null, data: null })}
        ></div>

        <form
          onSubmit={formik.handleSubmit}
          className="w-full md:w-1/3 h-full bg-white p-8 overflow-auto transform transition-transform duration-200 ease-in-out flex flex-col justify-between"
        >
          <div>
            <div className="grid grid-cols-2 gap-1 content-center md:grid-cols-2">
              <div>
                <strong>{titulo}</strong>
                <br />
                <strong>
                  <small
                    className={`${
                      crud.type == "create" ? "text-green-500" : null
                    } ${crud.type == "edit" ? "text-blue-500" : null} ${
                      crud.type == "delete" ? "text-red-500" : null
                    } `}
                  >
                    {crud.type == "create" ? "Crear" : null}
                    {crud.type == "edit" ? "Editar" : null}
                    {crud.type == "delete" ? "Eliminar" : null}
                  </small>{" "}
                </strong>
                <br />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-1 content-center md:grid-cols-2 mt-3">
              <div>
                {" "}
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
                tempor tincidunt augue, id finibus ipsum. Pellentesque habitant
                morbi tristique senectus et netus et malesuada fames ac turpis
                egestas. Ut convallis lacinia magna sollicitudin tincidunt. Duis
                feugiat massa non cursus rutrum. Morbi ac consequat nulla.
                Suspendisse bibendum erat urna, id iaculis justo porta at. Ut
                dictum leo sit amet est aliquet, sed gravida turpis congue.
                Aenean mattis, erat vel efficitur cursus, ante ante semper
                lectus, vitae gravida neque sem et arcu. In feugiat sit amet
                lacus sit amet fringilla. Ut dictum dui at metus ultricies
                pellentesque. Maecenas facilisis arcu ut enim blandit ultrices.
                Aenean ac sapien non ipsum mollis luctus fermentum quis ipsum.
                Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
                posuere cubilia curae; Vestibulum nibh quam, posuere quis
                dignissim eget, semper non lacus. Fusce est turpis, convallis ac
                metus sed, consequat ornare nisl. Cras non bibendum nisl. Nunc
                pulvinar ultrices orci, sed tristique lectus elementum id. Nam
                tincidunt placerat dui ut ullamcorper. Quisque ut sollicitudin
                nisi, semper tincidunt velit. Maecenas non turpis est.
                Suspendisse lobortis sed nisi vel volutpat. Nam semper rhoncus
                arcu, eu scelerisque velit hendrerit vitae. Ut dictum tortor eu
                elit aliquet consectetur. Sed ac nisl non turpis faucibus
                ultricies. Ut dictum ac nisi eget volutpat. Nam a magna aliquet,
                luctus libero et, volutpat libero. Maecenas placerat quam non
                sagittis egestas. Duis malesuada venenatis magna, at pretium
                magna cursus et. Nunc id aliquet mauris. Maecenas quam ante,
                elementum vitae rutrum non, pellentesque ut lectus. Aenean ac
                semper augue. Aenean eu arcu fermentum, malesuada tortor nec,
                blandit orci. Vivamus viverra viverra neque at fringilla. Etiam
                elit felis, vehicula in luctus nec, consequat at neque. Quisque
                quis enim imperdiet, egestas tellus at, elementum metus. Duis
                tincidunt ex sit amet gravida ullamcorper. Vestibulum vitae arcu
                ullamcorper, pretium tellus eget, vestibulum risus. Donec id
                metus vitae felis vulputate tincidunt. Vestibulum sit amet
                vehicula dui. Nam quis arcu et urna euismod ultrices.
                Suspendisse et iaculis tellus. Curabitur sed risus nec quam
                accumsan euismod. Donec eget porttitor velit. Maecenas eu leo
                elit. Vestibulum luctus sapien et massa commodo elementum.
                Integer a bibendum erat, id ornare diam. Praesent eu varius
                justo. Duis dapibus elit scelerisque iaculis pellentesque.
                Vestibulum dignissim tellus et luctus viverra. Etiam non luctus
                libero. Suspendisse enim purus, ultricies vel efficitur auctor,
                rhoncus vel nibh. Nulla vel nulla ut quam aliquam pharetra id at
                odio. Sed mi tortor, maximus quis tempus quis, dictum nec erat.
                Duis et feugiat mauris, quis tristique mauris. Proin eu turpis
                vitae justo euismod ultricies non vel massa. Cras eros ligula,
                scelerisque sit amet venenatis vitae, faucibus eu orci. In
                euismod at ante vitae lacinia. Phasellus semper malesuada lectus
                non volutpat. Donec sed augue justo. Morbi id lobortis sapien.
                In sodales ultricies erat, sit amet cursus ex. Phasellus
                convallis nisi ac hendrerit pellentesque. Etiam tempus odio et
                eleifend efficitur. Nullam vitae dolor ligula. Nulla ac odio sed
                massa pellentesque hendrerit quis sagittis metus. In imperdiet
                ut sapien ac aliquet. Maecenas porttitor et tortor vel luctus.
                Pellentesque nec enim nibh. Vestibulum eu sapien felis. Nullam
                vulputate, magna tempus placerat rutrum, dui ante consectetur
                ex, sed porttitor orci nulla nec elit. Sed consequat felis nec
                justo imperdiet ultrices. Cras bibendum risus dolor, id euismod
                sapien accumsan sit amet. Suspendisse enim lorem, gravida sed
                tortor nec, imperdiet consequat ante. Nullam bibendum tempor
                venenatis. Vivamus vitae diam ultrices, sodales erat eu,
                vestibulum neque. Etiam iaculis ullamcorper libero ut maximus.
                Etiam tempor mi a dolor ornare finibus. Duis pulvinar neque
                diam, id commodo quam sagittis ac. Nunc eget odio vel dolor
                venenatis bibendum. Donec condimentum purus nec aliquam finibus.
                Quisque at enim vulputate, eleifend nisl eget, pulvinar est.
                Aenean vulputate fringilla ex, sed dictum quam tempor in. Mauris
                faucibus scelerisque dignissim. In id tincidunt dui. Cras augue
                mi, facilisis et elit id, porttitor egestas erat. Nulla orci
                lorem, cursus a tempor eu, tristique at elit. Donec tincidunt ac
                nibh eu ultricies. Ut tincidunt interdum nunc, ut tempor lacus
                elementum a. Nulla gravida et quam ornare lacinia. Pellentesque
                auctor erat in fermentum consequat. Maecenas scelerisque mauris
                a mi lobortis, id finibus nibh molestie. Phasellus vehicula urna
                eget aliquam tincidunt. Donec vitae venenatis erat. Donec dictum
                leo erat, ut eleifend elit maximus sit amet. Vivamus in nibh
                malesuada, pharetra odio non, sodales ipsum. Nullam erat mi,
                sollicitudin sed sagittis pellentesque, porttitor et libero.
                Suspendisse sit amet elit eget nulla volutpat ornare.
                Suspendisse potenti. Nulla rutrum dui a justo tincidunt
                lobortis. Nulla pulvinar sodales mollis. Vestibulum venenatis
                justo sed quam venenatis, in placerat augue efficitur. Nulla
                semper arcu ac purus posuere tincidunt. Nunc porttitor
                ullamcorper sollicitudin. Sed ipsum felis, viverra id lectus ac,
                aliquet placerat neque. Nam diam nulla, vehicula eu fringilla a,
                dictum eu tortor. Ut in eleifend elit. Etiam consectetur sem et
                metus mattis, nec placerat nisl dictum. Ut id ligula feugiat,
                consectetur eros non, cursus ligula. Aliquam vulputate leo quis
                tincidunt egestas. Phasellus id gravida dui. Nulla vehicula
                dolor justo, tempus consectetur justo posuere vitae. Mauris
                rhoncus facilisis orci eu laoreet. Mauris nec odio vel mauris
                eleifend maximus. Fusce quis convallis orci, eu malesuada nisi.
                Ut imperdiet neque vitae tempus facilisis. Mauris in cursus
                justo. Sed faucibus tincidunt aliquet. Suspendisse ac augue vel
                felis tristique rutrum.{" "}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className={`px-4 py-2 text-white ${
              crud.type == "create" ? "bg-green-500" : null
            } ${crud.type == "edit" ? "bg-blue-500" : null} ${
              crud.type == "delete" ? "bg-red-500" : null
            } rounded self-end w-full`}
          >
            {crud.type == "create" ? "Crear" : null}
            {crud.type == "edit" ? "Editar" : null}
            {crud.type == "delete" ? "Eliminar" : null} {titulo}
          </button>
        </form>
      </div>
    </>
  );
};

export default CrudPromocionesComponent;
