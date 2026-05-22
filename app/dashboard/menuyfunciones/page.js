"use client";
import React, { useState, useEffect } from "react";
import {
  Page,
  Layout,
  Card,
  Text,
  Button,
  TextField,
  Checkbox,
  BlockStack,
  InlineGrid,
  Box,
  Divider,
  Spinner,
} from "@shopify/polaris";
import { toast } from "react-toastify";
import ConvertTextToIconComponent from "@/components/ConvertTextToIconComponent";
import { getMenuYfunciones } from "@/lib/api/apiMenuYFunciones";
import {
  getPerfiles,
  createPerfil,
  getPerfilPermisos,
  savePerfilPermisos,
} from "@/lib/api/apiPerfiles";

const MenuYFuncionesScreenComponent = () => {
  // Estado para perfiles
  const [perfiles, setPerfiles] = useState([]);
  const [loadingPerfiles, setLoadingPerfiles] = useState(true);
  const [selectedPerfil, setSelectedPerfil] = useState(null);

  // Estado para crear perfil
  const [nuevoPerfilNombre, setNuevoPerfilNombre] = useState("");
  const [creatingPerfil, setCreatingPerfil] = useState(false);

  // Estado para menús y permisos
  const [menus, setMenus] = useState([]);
  const [loadingMenus, setLoadingMenus] = useState(true);
  const [permisos, setPermisos] = useState([]); // IDs de menús autorizados
  const [savingPermisos, setSavingPermisos] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    fetchPerfiles();
    fetchMenus();
  }, []);

  const fetchPerfiles = async () => {
    setLoadingPerfiles(true);
    try {
      const response = await getPerfiles();
      if (response && response.status === 200) {
        setPerfiles(response.data);
        // Seleccionar el primer perfil por defecto
        if (response.data.length > 0 && !selectedPerfil) {
          setSelectedPerfil(response.data[0]);
          fetchPermisos(response.data[0].idperfil);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingPerfiles(false);
    }
  };

  const fetchMenus = async () => {
    setLoadingMenus(true);
    try {
      const response = await getMenuYfunciones();
      if (response && response.status === 200) {
        setMenus(response.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMenus(false);
    }
  };

  const fetchPermisos = async (idperfil) => {
    try {
      const response = await getPerfilPermisos(idperfil);
      if (response && response.status === 200) {
        setPermisos(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectPerfil = (perfil) => {
    setSelectedPerfil(perfil);
    fetchPermisos(perfil.idperfil);
  };

  const handleTogglePermiso = (idmenu, checked) => {
    if (checked) {
      setPermisos((prev) => [...prev, idmenu]);
    } else {
      setPermisos((prev) => prev.filter((id) => id !== idmenu));
    }
  };

  const handleCreatePerfil = async () => {
    if (!nuevoPerfilNombre.trim()) {
      toast.error("Ingresa un nombre de perfil válido");
      return;
    }
    setCreatingPerfil(true);
    try {
      const response = await createPerfil(nuevoPerfilNombre);
      if (response && response.status === 200) {
        toast.success("Perfil creado correctamente");
        setNuevoPerfilNombre("");
        // Recargar perfiles y seleccionar el nuevo
        const freshResponse = await getPerfiles();
        if (freshResponse && freshResponse.status === 200) {
          setPerfiles(freshResponse.data);
          const creado = freshResponse.data.find(
            (p) => p.nombre === nuevoPerfilNombre
          );
          if (creado) {
            setSelectedPerfil(creado);
            setPermisos([]);
          }
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setCreatingPerfil(false);
    }
  };

  const handleSavePermisos = async () => {
    if (!selectedPerfil) return;
    setSavingPermisos(true);
    try {
      const response = await savePerfilPermisos(
        selectedPerfil.idperfil,
        permisos
      );
      if (response && response.status === 200) {
        toast.success(`Permisos para "${selectedPerfil.nombre}" guardados con éxito`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSavingPermisos(false);
    }
  };

  return (
    <Page
      title="Perfiles y Permisos"
      subtitle="Administración de accesos a pantallas por perfil de usuario"
    >
      <Layout>
        {/* Panel Izquierdo: Lista de Perfiles */}
        <Layout.Section variant="oneThird">
          <BlockStack gap="4">
            <Card roundedAbove="sm">
              <BlockStack gap="4">
                <Box paddingBlockEnd="2">
                  <Text as="h2" variant="headingMd">
                    Perfiles de Acceso
                  </Text>
                  <Text as="p" variant="bodySm" tone="subdued">
                    Selecciona un perfil para ver o editar sus accesos.
                  </Text>
                </Box>
                <Divider />
                {loadingPerfiles ? (
                  <div className="flex justify-center p-4">
                    <Spinner size="small" />
                  </div>
                ) : (
                  <div className="space-y-1">
                    {perfiles.map((p) => {
                      const isSelected =
                        selectedPerfil?.idperfil === p.idperfil;
                      return (
                        <div
                          key={p.idperfil}
                          onClick={() => handleSelectPerfil(p)}
                          className={`w-full text-left px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-between border ${
                            isSelected
                              ? "bg-red-800 border-red-900 text-white shadow-sm font-semibold"
                              : "bg-white hover:bg-gray-50 border-gray-100 text-gray-700 hover:text-gray-900"
                          }`}
                        >
                          <span>{p.nombre}</span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              isSelected
                                ? "bg-red-900/50 text-white border border-red-700/55"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            ID: {p.idperfil}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </BlockStack>
            </Card>

            {/* Crear Perfil */}
            <Card roundedAbove="sm">
              <BlockStack gap="4">
                <Text as="h3" variant="headingSm">
                  Crear Nuevo Perfil
                </Text>
                <TextField
                  label="Nombre del perfil"
                  labelHidden
                  value={nuevoPerfilNombre}
                  onChange={(val) => setNuevoPerfilNombre(val)}
                  placeholder="Ej. Marketing, Gerente"
                  autoComplete="off"
                  disabled={creatingPerfil}
                />
                <Button
                  onClick={handleCreatePerfil}
                  loading={creatingPerfil}
                  variant="primary"
                  fullWidth
                >
                  Agregar Perfil
                </Button>
              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>

        {/* Panel Derecho: Checklist de Pantallas Autorizadas */}
        <Layout.Section>
          <Card roundedAbove="sm">
            {selectedPerfil ? (
              <BlockStack gap="4">
                <div className="flex justify-between items-center pb-2">
                  <div>
                    <Text as="h2" variant="headingMd">
                      Accesos Autorizados: {selectedPerfil.nombre}
                    </Text>
                    <Text as="p" variant="bodySm" tone="subdued">
                      Define a qué pantallas tiene acceso este rol. Las pantallas no marcadas no se mostrarán en su menú lateral.
                    </Text>
                  </div>
                  <Button
                    onClick={handleSavePermisos}
                    loading={savingPermisos}
                    variant="primary"
                  >
                    Guardar Cambios
                  </Button>
                </div>
                <Divider />

                {loadingMenus ? (
                  <div className="flex justify-center p-8">
                    <Spinner size="large" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {menus.map((menuItem) => {
                      const isChecked = permisos.includes(menuItem.idmenu);
                      return (
                        <div
                          key={menuItem.idmenu}
                          onClick={() =>
                            handleTogglePermiso(menuItem.idmenu, !isChecked)
                          }
                          className={`p-4 rounded-xl border transition-all duration-200 flex items-center justify-between cursor-pointer ${
                            isChecked
                              ? "bg-red-50/40 border-red-200/80 shadow-sm"
                              : "bg-white border-gray-100 hover:border-gray-200"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                isChecked
                                  ? "bg-red-800 text-white shadow-sm"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              <ConvertTextToIconComponent
                                className="h-5 w-5 shrink-0"
                                textIcon={menuItem.icono}
                              />
                            </div>
                            <div>
                              <span className="font-semibold text-gray-900 block text-sm">
                                {menuItem.nombre}
                              </span>
                              <span className="text-xs text-gray-400">
                                Ruta: /dashboard{menuItem.enlace}
                              </span>
                            </div>
                          </div>
                          <div onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              label="Autorizado"
                              labelHidden
                              checked={isChecked}
                              onChange={(checked) =>
                                handleTogglePermiso(menuItem.idmenu, checked)
                              }
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {menus.length > 0 && (
                  <Box paddingBlockStart="4" className="flex justify-end">
                    <Button
                      onClick={handleSavePermisos}
                      loading={savingPermisos}
                      variant="primary"
                    >
                      Guardar Permisos
                    </Button>
                  </Box>
                )}
              </BlockStack>
            ) : (
              <div className="p-8 text-center text-gray-400">
                Selecciona un perfil a la izquierda para cargar sus permisos.
              </div>
            )}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default MenuYFuncionesScreenComponent;
