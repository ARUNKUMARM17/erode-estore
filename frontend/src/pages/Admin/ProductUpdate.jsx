import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";

const AdminProductUpdate = () => {
  const params = useParams();

  const { data: productData, refetch } = useGetProductByIdQuery(params._id);

  const [image, setImage] = useState(productData?.image || "");
  const [name, setName] = useState(productData?.name || "");
  const [description, setDescription] = useState(productData?.description || "");
  const [price, setPrice] = useState(productData?.price || "");
  const [category, setCategory] = useState(productData?.category || "");
  const [quantity, setQuantity] = useState(productData?.quantity || "");
  const [brand, setBrand] = useState(productData?.brand || "");
  const [stock, setStock] = useState(productData?.countInStock);
  const [isPrimeEligible, setIsPrimeEligible] = useState(productData?.primeDiscount?.isEligible || false);
  const [primeDiscountType, setPrimeDiscountType] = useState(productData?.primeDiscount?.discountType || "percentage");
  const [primeDiscountValue, setPrimeDiscountValue] = useState(productData?.primeDiscount?.discountValue || "");

  const navigate = useNavigate();
  const { data: categories = [] } = useFetchCategoriesQuery();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    if (productData && productData._id) {
      setName(productData.name);
      setDescription(productData.description);
      setPrice(productData.price);
      setCategory(productData.category?._id || productData.category);
      setQuantity(productData.quantity);
      setBrand(productData.brand);
      setImage(productData.image);
      setStock(productData.countInStock);
      setIsPrimeEligible(productData.primeDiscount?.isEligible || false);
      setPrimeDiscountType(productData.primeDiscount?.discountType || "percentage");
      setPrimeDiscountValue(productData.primeDiscount?.discountValue || "");
    }
  }, [productData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !description || !price || !category || !quantity || !brand || !image) {
      toast.error("All fields are required");
      return;
    }

    try {
      const data = await updateProduct({
        productId: params._id,
        name,
        description,
        price: Number(price),
        regularPrice: Number(price),
        category,
        quantity: Number(quantity),
        brand,
        countInStock: Number(stock),
        image,
        primeDiscount: {
          isEligible: isPrimeEligible,
          discountType: primeDiscountType,
          discountValue: isPrimeEligible ? Number(primeDiscountValue) : 0
        }
      }).unwrap();

      toast.success("Product successfully updated");
      refetch();
      navigate("/admin/allproductslist");
    } catch (err) {
      console.error("Update error:", err);
      toast.error(err?.data?.error || err?.data?.message || "Product update failed. Try again.");
    }
  };

  const handleDelete = async () => {
    try {
      let answer = window.confirm(
        "Are you sure you want to delete this product?"
      );
      if (!answer) return;

      const data = await deleteProduct(params._id).unwrap();
      toast.success(`Product successfully deleted`);
      navigate("/admin/allproductslist");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err?.data?.error || err?.data?.message || "Delete failed. Try again.");
    }
  };

  return (
    <>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row">
          <AdminMenu />
          <div className="md:w-3/4 p-3 w-full">
            <div className="h-12 text-xl font-bold mb-4">Update / Delete Product</div>

            {image && (
              <div className="text-center mb-4">
                <img
                  src={image}
                  alt="product"
                  className="block mx-auto max-h-[200px]"
                />
              </div>
            )}

            <div className="mb-3">
              <label className="block text-gray-400 mb-2">Image URL</label>
              <input
                type="text"
                className="w-full p-2 border rounded bg-[#101011] text-white"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="Enter image URL"
              />
            </div>

            <div className="p-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-3">
                  <label htmlFor="name">Name</label> <br />
                  <input
                    type="text"
                    className="p-2 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="brand">Brand</label> <br />
                  <input
                    type="text"
                    className="p-2 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="price">Price</label> <br />
                  <input
                    type="number"
                    className="p-2 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="quantity">Quantity</label> <br />
                  <input
                    type="number"
                    className="p-2 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="category">Category</label> <br />
                  <select
                    placeholder="Choose Category"
                    className="p-2 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                    onChange={(e) => setCategory(e.target.value)}
                    value={category}
                  >
                    <option value="">Select Category</option>
                    {categories?.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="stock">Stock</label> <br />
                  <input
                    type="number"
                    className="p-2 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="description">Description</label> <br />
                <textarea
                  className="p-2 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                />
              </div>

              {/* Prime Discount Section */}
              <div className="mb-6 p-4 border border-pink-500/30 rounded-lg">
                <div className="mb-4">
                  <label className="flex items-center text-gray-400 mb-2">
                    <input
                      type="checkbox"
                      checked={isPrimeEligible}
                      onChange={(e) => setIsPrimeEligible(e.target.checked)}
                      className="mr-2"
                    />
                    Eligible for Prime Discount
                  </label>
                </div>

                {isPrimeEligible && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-400 mb-2">Discount Type</label>
                      <select
                        value={primeDiscountType}
                        onChange={(e) => setPrimeDiscountType(e.target.value)}
                        className="w-full p-2 border rounded bg-[#101011] text-white"
                      >
                        <option value="percentage">Percentage</option>
                        <option value="fixed">Fixed Amount</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-400 mb-2">
                        {primeDiscountType === 'percentage' ? 'Discount Percentage' : 'Discount Amount'}
                      </label>
                      <input
                        type="number"
                        value={primeDiscountValue}
                        onChange={(e) => setPrimeDiscountValue(e.target.value)}
                        placeholder={primeDiscountType === 'percentage' ? "Enter percentage (0-100)" : "Enter amount"}
                        className="w-full p-2 border rounded bg-[#101011] text-white"
                        min="0"
                        max={primeDiscountType === 'percentage' ? "100" : undefined}
                        required={isPrimeEligible}
                      />
                    </div>

                    {price && primeDiscountValue && (
                      <div className="text-gray-400">
                        <p>Prime members will pay: {
                          primeDiscountType === 'percentage'
                            ? `₹${(price * (1 - primeDiscountValue / 100)).toFixed(2)}`
                            : `₹${Math.max(0, price - primeDiscountValue).toFixed(2)}`
                        }</p>
                        <p>Savings: {
                          primeDiscountType === 'percentage'
                            ? `₹${(price * primeDiscountValue / 100).toFixed(2)}`
                            : `₹${Math.min(price, primeDiscountValue).toFixed(2)}`
                        }</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <button
                  className={`bg-pink-600 text-white py-2 px-4 rounded-lg ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handleSubmit}
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Updating...' : 'Update'}
                </button>
                <button
                  className="bg-red-600 text-white py-2 px-4 rounded-lg"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminProductUpdate;
