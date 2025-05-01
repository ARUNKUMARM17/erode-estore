import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateProductMutation } from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";

const ProductList = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [isPrimeEligible, setIsPrimeEligible] = useState(false);
  const [primeDiscountType, setPrimeDiscountType] = useState("percentage");
  const [primeDiscountValue, setPrimeDiscountValue] = useState("");
  
  const navigate = useNavigate();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productData = {
        name,
        description,
        price: Number(price),
        regularPrice: Number(price), // Set regularPrice same as price initially
        category,
        quantity: Number(quantity),
        brand,
        image: imageUrl,
        primeDiscount: {
          isEligible: isPrimeEligible,
          discountType: primeDiscountType,
          discountValue: isPrimeEligible ? Number(primeDiscountValue) : 0
        }
      };

      const { data } = await createProduct(productData);

      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success(`${data.name} is created`);
        navigate("/admin/allproductslist");
      }
    } catch (error) {
      console.error(error);
      toast.error("Product creation failed. Try again.");
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row">
        <AdminMenu />
        <div className="md:w-3/4 p-3 w-full">
          <div className="text-xl font-bold mb-4">Create Product</div>

          <form onSubmit={handleSubmit} className="mt-4">
            {imageUrl && (
              <div className="text-center mb-4">
                <img
                  src={imageUrl}
                  alt="product preview"
                  className="block mx-auto max-h-[200px]"
                />
              </div>
            )}

            <div className="mb-4">
              <label className="block text-gray-400 mb-2">Image URL</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Enter image URL"
                className="w-full p-2 border rounded bg-[#101011] text-white"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-400 mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Product name"
                className="w-full p-2 border rounded bg-[#101011] text-white"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-400 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Product description"
                className="w-full p-2 border rounded bg-[#101011] text-white"
                rows="4"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-gray-400 mb-2">Price</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Product price"
                  className="w-full p-2 border rounded bg-[#101011] text-white"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-400 mb-2">Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Product quantity"
                  className="w-full p-2 border rounded bg-[#101011] text-white"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-400 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border rounded bg-[#101011] text-white"
                required
              >
                <option value="">Select a category</option>
                {categories?.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-400 mb-2">Brand</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Product brand"
                className="w-full p-2 border rounded bg-[#101011] text-white"
                required
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

            <button
              type="submit"
              className="bg-pink-500 text-white py-2 px-4 rounded-lg text-lg w-full"
            >
              Create Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
