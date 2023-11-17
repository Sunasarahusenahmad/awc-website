import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "@/layouts/Loading";
import Header from "@/layouts/Header";
import DeleteModal from "@/layouts/DeleteModal";
import { useRouter } from "next/router";
import Link from "next/link";
import Toast, { ErrorToast, SuccessToast } from "@/layouts/toast/Toast";

const Products = () => {
  //filter Start
  const [filterValue, setFilterValue] = useState(""); // State to hold the filter value
  const handleFilterChange = (value) => {
    setFilterValue(value); // Update the filter value
  };

  useEffect(() => {
    setFilterdProduct(
      getAllProduct.filter((e) => {
        let data = e.product_title;
        return data.includes(filterValue);
      })
    );
  }, [filterValue]);
  // filter End

  const router = useRouter();
  const [filterdProduct, setFilterdProduct] = useState([]);
  const [getAllProduct, setGetAllProduct] = useState([]);
  const [getCategoryData, setGetCategoryData] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [loading, setLoading] = useState(true);

  //delete modal
  const openDeleteModal = (prodId) => {
    setSelectedCategoryId(prodId);
    setIsDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setSelectedCategoryId(null);
    setIsDeleteModalOpen(false);
  };
  const deleteCategory = () => {
    if (selectedCategoryId) {
      deleteProductData(selectedCategoryId);
      closeDeleteModal();
    }
  };
  const deleteProductData = async (deleteId) => {
    setLoading(true);
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${deleteId}`
      );
      getAllProductData();
      getProductategoryData();
      setLoading(false);
      SuccessToast("Product Deleted Successfully");
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
      setLoading(false);
    }
  };

  //get all prod category
  const getProductategoryData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/productcategorychanges/router`
      );
      setGetCategoryData(response.data);
      setLoading(false);
    } catch (err) {
      ErrorToast(err?.response?.data?.message);
      setLoading(false);
    }
  };

  //get all product data
  const getAllProductData = async () => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/products/router`)
      .then((res) => {
        setGetAllProduct(res.data);
        setFilterdProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        ErrorToast(err?.response?.data?.message);
        setLoading(false);
      });
  };

  //status edit
  const productStatusChange = async (prodId, no) => {
    setLoading(true);
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/statuschanges/${prodId}/${no}`
      );
      getAllProductData();
      getProductategoryData();
      setLoading(false);
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
      setLoading(false);
    }
  };

  //view product data
  const handleViewProduct = (id) => {
    setLoading(true);
    router.push(`/admin/products/view-product?id=${id}`);
  };

  //edit product data
  const handleEditProduct = (id) => {
    setLoading(true);
    router.push(`/admin/products/edit-product?id=${id}`);
  };

  useEffect(() => {
    getAllProductData();
    getProductategoryData();
  }, []);

  return (
    <>
      {loading && <Loading />}
      <section className="home-section">
        <Header  onFilterChange={handleFilterChange}   />
        <div className="admin_page_top">
          <div className="page_top_left_section">
            <p className="admin_page_header">Products</p>
            <p>
              <Link href="/admin/admindashboard">
                <i className="fa-solid fa-house"></i>
              </Link>
              <i className="fa-solid fa-angles-right"></i>
              <span>Products</span>
            </p>
          </div>
          <div className="content_add_btn_section">
            <Link href="/admin/products/add-product">
              <button type="button">
                <i className="fa-solid fa-plus"></i>Add Product
              </button>
            </Link>
          </div>
        </div>

        <div className="admin_category_table">
          <table>
            <thead>
              <tr>
                <th style={{ width: "15%" }}>ID</th>
                <th style={{ width: "30%" }}>TITLE</th>
                <th style={{ width: "25%" }}>IMAGE</th>
                <th style={{ width: "20%" }}>CATEGORY</th>
                <th style={{ width: "10%" }}>OPERATION</th>
              </tr>
            </thead>
            <tbody>
              {filterdProduct.length > 0 ? (
                filterdProduct.map((product, index) => (
                  <tr
                    key={product.product_id}
                    style={{ color: product.status === 1 ? "black" : "red" }}
                  >
                    <td>{index + 1}</td>
                    <td>{product.product_title}</td>
                    <td>
                      <img
                        src={`/assets/upload/products/${product.product_image}`}
                        width="100%"
                        alt="product"
                        className="tabel_data_image"
                      />
                    </td>
                    <td>
                      {product.cate_id
                        ? getCategoryData.find(
                            (category) =>
                              category.category_id === product.cate_id
                          )?.category_name
                        : "null"}
                    </td>
                    <td
                      style={{
                        paddingTop: "0px",
                        paddingBottom: "10px",
                        textAlign: "end",
                      }}
                    >
                      <span>
                        <button
                          className="editbutton"
                          onClick={() => {
                            handleEditProduct(product.product_id);
                          }}
                        >
                          <i className="fa-regular fa-pen-to-square"></i>
                        </button>
                      </span>
                      <label className="dropdown">
                        <div className="dd-button"></div>
                        <input type="checkbox" className="dd-input" id="test" />
                        <ul className="dd-menu">
                          <li
                            onClick={() => openDeleteModal(product.product_id)}
                          >
                            Delete
                          </li>
                          <li
                            onClick={() => {
                              handleViewProduct(product.product_id);
                            }}
                          >
                            View
                          </li>
                          <li>Add Images</li>
                          <li>
                            {" "}
                            {product.status === 1 ? (
                              <button
                                onClick={() => {
                                  productStatusChange(product.product_id, 1);
                                }}
                              >
                                Active
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  productStatusChange(product.product_id, 0);
                                }}
                              >
                                Inactive
                              </button>
                            )}
                          </li>
                        </ul>
                      </label>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" align="center">
                    data is not available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* delete modal */}
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onDelete={deleteCategory}
        />
      </section>
    </>
  );
};

export default Products;
