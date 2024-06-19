"use client";

import { useEffect, useMemo, useState } from "react";
import AuthLayout from "@/components/Layouts/AuthLayout";
import Modal from "@/components/Modal/Modal";
import TablePagination from "@/components/TablePagination/TablePagination";
import { useDebounce } from "@/hooks/useDebounce";
import useSearchParamsCus from "@/hooks/useSearchParamsCus";
import {
  createProductApi,
  getProductsApi,
  updateProductApi,
} from "@/services/product.service";
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

const TYPE_MODAL = {
  CREATE: "create",
  EDIT: "edit",
  CLOSE: "",
};

export default function Products() {
  const searchParamsCus: any = useSearchParamsCus();
  const pathname = usePathname();
  const { replace } = useRouter();
  // const params = useParams();
  const [option, setOption] = useState<any>(searchParamsCus.paramsObj);
  const [products, setProducts] = useState<any>();
  const [userSelected, setUserSelected] = useState<any>();
  const [productSelected, setProductSelected] = useState<any>();

  const [isOpenModal, setIsOpenModal] = useState(TYPE_MODAL.CLOSE);

  const getListProduct = async () => {
    try {
      const res = await getProductsApi(option);
      setProducts(res?.data);
      console.log("getListProduct: ", res?.data);
      setOption({
        ...option,
        page: res?.data.meta.page,
      });
    } catch (error) {
      console.log("getListUser error", error);
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
    getListProduct();
  }, 100);

  const handleChangePage = (page: any) => {
    setOption({ ...option, page });
    handleSearch();
  };

  const handleShowEditModal = (product: any) => {
    setProductSelected(product);
    setIsOpenModal(TYPE_MODAL.EDIT);
  };

  const handleReload = () => {
    setIsOpenModal(TYPE_MODAL.CLOSE);
    getListProduct();
  } 

  useEffect(() => {
    getListProduct();
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
            Add product
          </button>
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                    Name
                  </th>
                  <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                    Price
                  </th>
                  <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                    Category
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
                {products?.data.map((product: any, key: any) => (
                  <tr key={key}>
                    <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                      <h5 className="font-medium text-black dark:text-white">
                        {product.name}
                      </h5>
                      {/* <p className="text-sm">${packageItem.price}</p> */}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-meta-3">
                        ${product.priceTags[0].price}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {product.categories[0].category.name}
                      </p>
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
                        <button className="hover:text-primary">
                          <svg
                            className="fill-current"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                              fill=""
                            />
                            <path
                              d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                              fill=""
                            />
                            <path
                              d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                              fill=""
                            />
                            <path
                              d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                              fill=""
                            />
                          </svg>
                        </button>
                        <button className="hover:text-primary">
                          <svg
                            className="fill-current"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M16.8754 11.6719C16.5379 11.6719 16.2285 11.9531 16.2285 12.3187V14.8219C16.2285 15.075 16.0316 15.2719 15.7785 15.2719H2.22227C1.96914 15.2719 1.77227 15.075 1.77227 14.8219V12.3187C1.77227 11.9812 1.49102 11.6719 1.12539 11.6719C0.759766 11.6719 0.478516 11.9531 0.478516 12.3187V14.8219C0.478516 15.7781 1.23789 16.5375 2.19414 16.5375H15.7785C16.7348 16.5375 17.4941 15.7781 17.4941 14.8219V12.3187C17.5223 11.9531 17.2129 11.6719 16.8754 11.6719Z"
                              fill=""
                            />
                            <path
                              d="M8.55074 12.3469C8.66324 12.4594 8.83199 12.5156 9.00074 12.5156C9.16949 12.5156 9.31012 12.4594 9.45074 12.3469L13.4726 8.43752C13.7257 8.1844 13.7257 7.79065 13.5007 7.53752C13.2476 7.2844 12.8539 7.2844 12.6007 7.5094L9.64762 10.4063V2.1094C9.64762 1.7719 9.36637 1.46252 9.00074 1.46252C8.66324 1.46252 8.35387 1.74377 8.35387 2.1094V10.4063L5.40074 7.53752C5.14762 7.2844 4.75387 7.31252 4.50074 7.53752C4.24762 7.79065 4.27574 8.1844 4.50074 8.43752L8.55074 12.3469Z"
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
          <TablePagination
            total={Math.ceil(products?.meta.total / 10 || 1)}
            currentPage={option?.page}
            setCurrentPage={handleChangePage}
          />
        </div>
      </AuthLayout>
      <Modal
        isOpen={isOpenModal == TYPE_MODAL.CREATE}
        onClose={() => setIsOpenModal("")}
        title={"Create Product"}
      >
        <FormCreateProduct onHandleSuccess={handleReload} />
      </Modal>
      <Modal
        isOpen={isOpenModal == TYPE_MODAL.EDIT}
        onClose={() => setIsOpenModal("")}
        title={"Update Product"}
      >
        <FormEditProduct
          product={productSelected}
          onHandleSuccess={handleReload}
        />
      </Modal>
    </>
  );
}

const FormCreateProduct = ({ onHandleSuccess }: any) => {
  const option_cate = [
    {
      label: "Laptop",
      value: "9c875cd2-6378-4ab7-b1d9-8d0008060d8c",
    },
    {
      label: "Keyboard",
      value: "927ce601-8b7d-40ac-9974-9aca457f673b",
    },
  ];

  const onSubmit = async () => {
    try {
      let data = { ...values };
      data.images = await handleImageUpload(data.images);
      await createProductApi(data);
      toast.success("Create Successfully!");
      onHandleSuccess();
    } catch (error) {
      toast.error("Create Failed!");
      console.log("create product error: ", error);
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
      description: "",
      categoryIds: [],
      images: [],
      priceTags: [
        {
          name: "",
          price: 0,
        },
      ],
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
        setFieldValue(`images[${values.images.length}]`, file[i]);
      } else {
      }
    }
  };

  const removeImage = (i: any) => {
    setFieldValue(
      "images",
      values.images.filter((x: any) => x.name !== i),
    );
  };

  const handleImageUpload = async (images: any) => {
    if (!images.length) {
      alert("Please select an image to upload.");
      throw "Please select an image to upload.";
    }

    const promises: any = [];
    const progress: any = {};
    const urls: any = [];

    images.forEach((image: any, index: number) => {
      const storageRef = ref(
        storage,
        `images/products/${values.name.replace(/ /g, "_")}/${image.name}`,
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
              urls.push(downloadURL);
              resolve();
            },
          );
        }),
      );
    });
    try {
      await Promise.all(promises);
      console.log("All files uploaded");

      // Xử lý bước tiếp theo ở đây
    } catch (error) {
      console.error("Error uploading files:", error);
    }
    // await Promise.all(promises);
    return urls;
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="max-h-[55vh] overflow-auto rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="p-6.5">
            <div className="mb-4.5">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Product Name
              </label>
              <input
                value={values.name}
                name="name"
                onChange={handleChange}
                onBlur={handleBlur}
                type="text"
                placeholder="Enter Product Name"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

            <div className="mb-6">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Product Description
              </label>
              <textarea
                rows={6}
                value={values.description}
                name="description"
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter Product Description"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              ></textarea>
            </div>

            <div className="mb-4.5">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Categories <span className="text-meta-1">*</span>
              </label>
              <Select
                name="categoryIds"
                isClearable
                isMulti
                options={option_cate}
                value={values.categoryIds}
                onChange={(selectedOption: any) => {
                  handleChange({
                    target: { name: "categoryIds", value: selectedOption },
                  });
                }}
                noOptionsMessage={() => "No options"}
                classNames={{
                  control: () =>
                    "w-full rounded border-[1.5px] border-stroke bg-transparent px-3 py-1 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary",
                  valueContainer: () => "",
                }}
                onBlur={handleBlur}
              />
            </div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Price
            </label>

            <div className="flex flex-col gap-3">
              {values.priceTags.map((priceTag: any, index: number) => {
                return (
                  <div
                    className="flex w-full items-center gap-2 xl:items-start"
                    key={index}
                  >
                    <div className="flex flex-1 flex-col gap-2 xl:flex-row">
                      <div className="w-full xl:w-1/2">
                        <input
                          type="text"
                          value={values.priceTags[index].name}
                          name={`priceTags[${index}].name`}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter name price tag"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                      </div>
                      <div className="w-full xl:w-1/2">
                        <input
                          type="number"
                          value={values.priceTags[index].price}
                          name={`priceTags[${index}].price`}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter price"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setFieldValue(
                          "priceTags",
                          values.priceTags.filter(
                            (_newE: any, newI: number) => newI !== index,
                          ),
                        );
                      }}
                      className="h-[51px] px-4 py-3 text-red-600 duration-300 hover:bg-red-600 hover:text-red-100"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                );
              })}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setFieldValue(`priceTags[${values.priceTags.length}]`, {
                    name: "",
                    price: 0,
                  });
                }}
                className="my-2 flex w-fit items-center gap-2 rounded bg-primary p-3 font-medium text-white hover:bg-opacity-80"
              >
                <PlusIcon />
              </button>
            </div>

            <div className="mb-4.5">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Images
              </label>
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
              <div className="mt-2 flex flex-wrap gap-2">
                {values.images.map((file: any, key: number) => {
                  return (
                    <div key={key} className="relative overflow-hidden">
                      <i
                        onClick={() => {
                          removeImage(file.name);
                        }}
                        className="mdi mdi-close absolute right-1 cursor-pointer hover:text-white"
                      ></i>
                      <img
                        className="h-20 w-20 rounded-md"
                        src={
                          typeof file === "string"
                            ? file
                            : URL.createObjectURL(file)
                        }
                      />
                    </div>
                  );
                })}
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

const FormEditProduct = ({ product, onHandleSuccess }: any) => {
  const option_cate = [
    {
      label: "Laptop",
      value: "9c875cd2-6378-4ab7-b1d9-8d0008060d8c",
    },
    {
      label: "Keyboard",
      value: "927ce601-8b7d-40ac-9974-9aca457f673b",
    },
  ];

  const categoriesFormat = useMemo(
    () =>
      product.categories.map((item: any) => {
        return {
          label: item.category.name,
          value: item.category.id,
        };
      }),
    [product],
  );

  const onSubmit = async () => {
    try {
      let data = { ...values };
      data.images = await handleImageUpload(data.images);
      console.log('after', data.images)
      await updateProductApi(product.id, data);
      toast.success("Update Successfully!");
      onHandleSuccess();
    } catch (error) {
      toast.error("Update Failed!");
      console.log("Update product error: ", error);
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
      name: product.name,
      description: product.description,
      categoryIds: categoriesFormat,
      images: product.images,
      priceTags: product.priceTags,
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
        setFieldValue(`images[${values.images.length}]`, file[i]);
      } else {
      }
    }
  };

  const removeImage = (i: any) => {
    setFieldValue(
      "images",
      values.images.filter((_x: any, index: number) => index !== i),
    );
  };

  const handleImageUpload = async (images: any) => {
    if (!images.length) {
      alert("Please select an image to upload.");
      throw "Please select an image to upload.";
    }

    const promises: any = [];
    const progress: any = {};

    const imageLink = images.filter((image: any) => typeof image === "string");
    const imageFile = images.filter((image: any) => typeof image !== "string");

    imageFile.forEach((image: any, index: number) => {
      const storageRef = ref(
        storage,
        `images/products/${values.name.replace(/ /g, "_")}/${image.name}`,
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
              imageLink.push(downloadURL);
              resolve();
            },
          );
        }),
      );
    });
    try {
      await Promise.all(promises);
      console.log("All files uploaded");

      // Xử lý bước tiếp theo ở đây
    } catch (error) {
      console.error("Error uploading files:", error);
    }



    // for (let i = 0; i < imageFile.length; i++) {
    //   // if (typeof images[i] === "string") {
    //   //   continue;
    //   // }
    //   console.log("index image: ", i);
    //   const storageRef = ref(
    //     storage,
    //     `images/products/${values.name.replace(/ /g, "_")}/${imageFile[i].name}`,
    //   );
    //   const uploadTask = uploadBytesResumable(storageRef, imageFile[i]);

    //   uploadTask.on(
    //     "state_changed",
    //     (snapshot) => {
    //       const progressPercentage = Math.round(
    //         (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
    //       );
    //       progress[imageFile[i].name] = progressPercentage;
    //     },
    //     (error) => {
    //       console.error("Upload failed:", error);
    //     },
    //     async () => {
    //       const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
    //       imageLink.push(downloadURL);
    //       console.log("File available at", downloadURL);
    //     },
    //   );

    //   promises.push(uploadTask);
    // }

    // await Promise.all(promises);
    return imageLink;
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="max-h-[55vh] overflow-auto rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="p-6.5">
            <div className="mb-4.5">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Product Name
              </label>
              <input
                value={values.name}
                name="name"
                onChange={handleChange}
                onBlur={handleBlur}
                type="text"
                placeholder="Enter Product Name"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

            <div className="mb-6">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Product Description
              </label>
              <textarea
                rows={6}
                value={values.description}
                name="description"
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter Product Description"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              ></textarea>
            </div>

            <div className="mb-4.5">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Categories <span className="text-meta-1">*</span>
              </label>
              <Select
                name="categoryIds"
                isClearable
                isMulti
                options={option_cate}
                value={values.categoryIds}
                onChange={(selectedOption: any) => {
                  handleChange({
                    target: { name: "categoryIds", value: selectedOption },
                  });
                }}
                noOptionsMessage={() => "No options"}
                classNames={{
                  control: () =>
                    "w-full rounded border-[1.5px] border-stroke bg-transparent px-3 py-1 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary",
                  valueContainer: () => "",
                }}
                onBlur={handleBlur}
              />
            </div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Price
            </label>

            <div className="flex flex-col gap-3">
              {values.priceTags.map((priceTag: any, index: number) => {
                return (
                  <div
                    className="flex w-full items-center gap-2 xl:items-start"
                    key={index}
                  >
                    <div className="flex flex-1 flex-col gap-2 xl:flex-row">
                      <div className="w-full xl:w-1/2">
                        <input
                          type="text"
                          value={values.priceTags[index].name}
                          name={`priceTags[${index}].name`}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter name price tag"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                      </div>
                      <div className="w-full xl:w-1/2">
                        <input
                          type="number"
                          value={values.priceTags[index].price}
                          name={`priceTags[${index}].price`}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter price"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mb-4.5">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Images
              </label>
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
              <div className="mt-2 flex flex-wrap gap-2">
                {values.images.map((file: any, index: number) => {
                  return (
                    <div key={index} className="relative overflow-hidden">
                      <i
                        onClick={() => {
                          removeImage(index);
                        }}
                        className="mdi mdi-close absolute right-1 cursor-pointer hover:text-white"
                      ></i>
                      <img
                        className="h-20 w-20 rounded-md"
                        src={
                          typeof file === "string"
                            ? file
                            : URL.createObjectURL(file)
                        }
                      />
                    </div>
                  );
                })}
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
