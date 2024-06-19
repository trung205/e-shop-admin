"use client";

import { useEffect, useMemo, useState } from "react";
import AuthLayout from "@/components/Layouts/AuthLayout";
import Modal from "@/components/Modal/Modal";
import TablePagination from "@/components/TablePagination/TablePagination";
import { useDebounce } from "@/hooks/useDebounce";
import useSearchParamsCus from "@/hooks/useSearchParamsCus";
import { createProductApi, updateProductApi } from "@/services/product.service";
import { getUsersApi } from "@/services/user.service";
import { useFormik } from "formik";
import {
  usePathname,
  useRouter,
  useParams,
  useSearchParams,
} from "next/navigation";
import Select, { StylesConfig } from "react-select";
import TrashIcon from "@/components/Icons/TrashIcon";
import PlusIcon from "@/components/Icons/PlusIcon";
import { formatDate } from "@/utils/funtions";
import { storage } from "@/app/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";
import { createCategoryApi, getCategoriesApi, updateCategoryApi } from "@/services/category.service";

const TYPE_MODAL = {
  CREATE: "create",
  EDIT: "edit",
  CLOSE: "",
};

export default function Categories() {
  const searchParamsCus: any = useSearchParamsCus();
  const pathname = usePathname();
  const { replace } = useRouter();
  // const params = useParams();
  const [option, setOption] = useState<any>(searchParamsCus.paramsObj);
  const [categories, setCategories] = useState<any>();
  const [userSelected, setUserSelected] = useState<any>();
  const [categorySelected, setCategorySelected] = useState<any>();

  const [isOpenModal, setIsOpenModal] = useState(TYPE_MODAL.CLOSE);

  const getListCategory = async () => {
    try {
      const res = await getCategoriesApi(option);
      setCategories(res?.data);
      console.log("getListCategory: ", res?.data);
    } catch (error) {
      console.log("getListCategory error", error);
    }
  };

  const handleSearch = useDebounce((term: string) => {
    const params = new URLSearchParams(searchParamsCus.searchParams);
    if (option) {
      for (let key in option) {
        params.set(key, option[key]);
      }
    }
    replace(`${pathname}?${params.toString()}`);
    getListCategory();
  }, 100);

  const handleChangePage = (page: any) => {
    setOption({ ...option, page });
    handleSearch();
  };

  const handleShowEditModal = (product: any) => {
    setCategorySelected(product);
    setIsOpenModal(TYPE_MODAL.EDIT);
  };

  const handleReload = () => {
    setIsOpenModal(TYPE_MODAL.CLOSE);
    getListCategory();
  };

  useEffect(() => {
    getListCategory();
  }, []);

  return (
    <>
      <AuthLayout>
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <button
            onClick={() => setIsOpenModal(TYPE_MODAL.CREATE)}
            className="my-2 flex items-center gap-2 rounded bg-primary px-4.5 py-2 font-medium text-white hover:bg-opacity-80"
          >
            <svg
              className="fill-current"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 7H9V1C9 0.4 8.6 0 8 0C7.4 0 7 0.4 7 1V7H1C0.4 7 0 7.4 0 8C0 8.6 0.4 9 1 9H7V15C7 15.6 7.4 16 8 16C8.6 16 9 15.6 9 15V9H15C15.6 9 16 8.6 16 8C16 7.4 15.6 7 15 7Z"
                fill=""
              ></path>
            </svg>
            Add Category
          </button>
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                    Name
                  </th>

                  <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                    Created At
                  </th>
                  <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                    Updated At
                  </th>
                  <th className="px-4 py-4 font-medium text-black dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories?.map((product: any, key: any) => (
                  <tr key={key}>
                    <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                      <h5 className="font-medium text-black dark:text-white">
                        {product.name}
                      </h5>
                      {/* <p className="text-sm">${packageItem.price}</p> */}
                    </td>

                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {formatDate(product.createdAt)}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {formatDate(product.updatedAt)}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <div className="flex items-center space-x-3.5">
                        <button
                          className="hover:text-primary"
                          onClick={() => handleShowEditModal(product)}
                        >
                          <svg
                            className="fill-current"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                              fill=""
                            />
                            <path
                              d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                              fill=""
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </AuthLayout>
      <Modal
        isOpen={isOpenModal == TYPE_MODAL.CREATE}
        onClose={() => setIsOpenModal("")}
        title={"Create Category"}
      >
        <FormCreateCategory onHandleSuccess={handleReload} />
      </Modal>
      <Modal
        isOpen={isOpenModal == TYPE_MODAL.EDIT}
        onClose={() => setIsOpenModal("")}
        title={"Update Category"}
      >
        <FormEditCategory
          category={categorySelected}
          onHandleSuccess={handleReload}
        />
      </Modal>
    </>
  );
}

const FormCreateCategory = ({ onHandleSuccess }: any) => {
  const onSubmit = async () => {
    try {
      let data = { ...values };
      data.image = await handleImageUpload(data.image);
      await createCategoryApi(data);
      toast.success("Create Successfully!");
      onHandleSuccess();
    } catch (error) {
      toast.error("Create Failed!");
      console.log("create category error: ", error);
    }
  };

  const {
    handleSubmit,
    errors,
    values,
    handleBlur,
    handleChange,
    dirty,
    touched,
    setFieldValue,
  }: any = useFormik({
    initialValues: {
      name: "",
      image: null,
    },
    onSubmit,
    enableReinitialize: true,
    // validationSchema: SignInSchema,
  });

  const handleFile = (e: any) => {
    let file = e.target.files;

    for (let i = 0; i < file.length; i++) {
      const fileType = file[i]["type"];
      const validImageTypes = ["image/gif", "image/jpeg", "image/png"];
      if (validImageTypes.includes(fileType)) {
        setFieldValue("image", file[i]);
      } else {
      }
    }
  };

  const removeImage = () => {
    setFieldValue("image", null);
  };

  const handleImageUpload = async (image: any) => {
    if (!image) {
      alert("Please select an image to upload.");
      throw "Please select an image to upload.";
    }

    const promises: any = [];
    const progress: any = {};
    let url: any = "";

    const storageRef = ref(
      storage,
      `images/categories/${values.name.replace(/ /g, "_")}/${image.name}`,
    );
    const uploadTask = uploadBytesResumable(storageRef, image);

    promises.push(
      new Promise<void>((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progressPercentage = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
            );
            progress[image.name] = progressPercentage;
          },
          (error) => {
            console.error("Upload failed:", error);
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            url = downloadURL;
            resolve();
          },
        );
      }),
    );
    try {
      await Promise.all(promises);
      console.log("All files uploaded");

      // Xử lý bước tiếp theo ở đây
    } catch (error) {
      console.error("Error uploading files:", error);
    }
    // await Promise.all(promises);
    return url;
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="max-h-[55vh] overflow-auto rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="p-6.5">
            <div className="mb-4.5">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Category Name
              </label>
              <input
                value={values.name}
                name="name"
                onChange={handleChange}
                onBlur={handleBlur}
                type="text"
                placeholder="Enter Category Name"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

            <div className="mb-4.5">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Images
              </label>
              {!values.image ? (
                <div className="bg-gray-300 border-gray-400 relative h-32 w-full cursor-pointer items-center rounded-md border-2 border-dotted">
                  <input
                    type="file"
                    onChange={handleFile}
                    className="absolute z-10 h-full w-full bg-green-200 opacity-0"
                    name="files[]"
                  />
                  <div className="bg-gray-200 absolute top-0 z-1 flex h-full w-full items-center justify-center">
                    <div className="flex flex-col">
                      <i className="mdi mdi-folder-open text-gray-400 text-center text-[30px]"></i>
                      <span className="text-[12px]">{`Drag and Drop a file`}</span>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="mt-2 flex flex-wrap gap-2">
                {values.image ? (
                  <div className="relative overflow-hidden">
                    <i
                      onClick={() => {
                        removeImage();
                      }}
                      className="mdi mdi-close absolute right-1 cursor-pointer hover:text-white"
                    ></i>
                    <img
                      className="h-20 w-20 rounded-md"
                      src={
                        typeof values.image === "string"
                          ? values.image
                          : URL.createObjectURL(values.image)
                      }
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <button className="mt-5 flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
          Create
        </button>
      </form>
    </div>
  );
};

const FormEditCategory = ({ category, onHandleSuccess }: any) => {

  const onSubmit = async () => {
    try {
      let data = { ...values };
      data.image = await handleImageUpload(data.image);
      console.log("after", data.image);
      await updateCategoryApi(category.id, data);
      toast.success("Update Successfully!");
      onHandleSuccess();
    } catch (error) {
      toast.error("Update Failed!");
      console.log("Update Category error: ", error);
    }
  };

  const {
    handleSubmit,
    errors,
    values,
    handleBlur,
    handleChange,
    dirty,
    touched,
    setFieldValue,
  }: any = useFormik({
    initialValues: {
      name: category.name,
      image: category.image,
    },
    onSubmit,
    enableReinitialize: true,
    // validationSchema: SignInSchema,
  });

  const handleFile = (e: any) => {
    let file = e.target.files;
    for (let i = 0; i < file.length; i++) {
      const fileType = file[i]["type"];
      const validImageTypes = ["image/gif", "image/jpeg", "image/png"];
      if (validImageTypes.includes(fileType)) {
        setFieldValue("image", file[i]);
      } else {
      }
    }
  };

  const removeImage = () => {
    setFieldValue(
      "image",
      null
    );
  };

  const handleImageUpload = async (image: any) => {
    if (!image) {
      alert("Please select an image to upload.");
      throw "Please select an image to upload.";
    }

    if ( typeof image === "string") return image;

    const promises: any = [];
    const progress: any = {};
    let url: any = null;

      const storageRef = ref(
        storage,
        `images/categories/${values.name.replace(/ /g, "_")}/${image.name}`,
      );
      const uploadTask = uploadBytesResumable(storageRef, image);

      promises.push(
        new Promise<void>((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progressPercentage = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
              );
              progress[image.name] = progressPercentage;
            },
            (error) => {
              console.error("Upload failed:", error);
              reject(error);
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              url = downloadURL;
              resolve();
            },
          );
        }),
      );
    try {
      await Promise.all(promises);
      console.log("All files uploaded");

      // Xử lý bước tiếp theo ở đây
    } catch (error) {
      console.error("Error uploading files:", error);
    }

    return url;
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="max-h-[55vh] overflow-auto rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="p-6.5">
            <div className="mb-4.5">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Category Name
              </label>
              <input
                value={values.name}
                name="name"
                onChange={handleChange}
                onBlur={handleBlur}
                type="text"
                placeholder="Enter Category Name"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

            <div className="mb-4.5">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Images
              </label>
              {!values.image ? (
                <div className="bg-gray-300 border-gray-400 relative h-32 w-full cursor-pointer items-center rounded-md border-2 border-dotted">
                  <input
                    type="file"
                    onChange={handleFile}
                    className="absolute z-10 h-full w-full bg-green-200 opacity-0"
                    name="files[]"
                  />
                  <div className="bg-gray-200 absolute top-0 z-1 flex h-full w-full items-center justify-center">
                    <div className="flex flex-col">
                      <i className="mdi mdi-folder-open text-gray-400 text-center text-[30px]"></i>
                      <span className="text-[12px]">{`Drag and Drop a file`}</span>
                    </div>
                  </div>
                </div>
              ) : null}
              <div className="mt-2 flex flex-wrap gap-2">
                {values.image ? (
                  <div className="relative overflow-hidden">
                    <i
                      onClick={() => {
                        removeImage();
                      }}
                      className="mdi mdi-close absolute right-1 cursor-pointer hover:text-white"
                    ></i>
                    <img
                      className="h-20 w-20 rounded-md"
                      src={
                        typeof values.image === "string"
                          ? values.image
                          : URL.createObjectURL(values.image)
                      }
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <button className="mt-5 flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
          Update
        </button>
      </form>
    </div>
  );
};
