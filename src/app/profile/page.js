"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiEdit2,
  FiSave,
  FiX,
  FiShoppingBag,
  FiPackage,
  FiHeart,
  FiLogOut,
} from "react-icons/fi";
import { MdOutlineLocationCity, MdOutlinePinDrop } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import toast from "react-hot-toast";
import apiClient from "./../../api/client";
import useAuth from "./../../auth/useAuth";
import Loader from "./../../utility/Loader";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logOut } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: {
      area: "",
      city: "",
      state: "",
      landmark: "",
      pincode: "",
      country: "",
    },
  });
  const [errors, setErrors] = useState({});

  const fetchUserProfile = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      const response = await apiClient.get("/user/get-user-by-id", {
        id: user.id,
      });

      if (response.ok && response.data) {
        const userData = response.data.user;
        setUserData(userData);
        setFormData({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
          phone: userData.phone || "",
          address: {
            area: userData.address?.area || "",
            city: userData.address?.city || "",
            state: userData.address?.state || "",
            landmark: userData.address?.landmark || "",
            pincode: userData.address?.pincode || "",
            country: userData.address?.country || "",
          },
        });
      } else {
        toast.error("Failed to load profile");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Error loading profile");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchUserProfile();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9][0-9]{9}$/;

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = "Please enter a valid Indian mobile number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors before saving");
      return;
    }
			console.log("paylod", {
        userId: user?.id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: {
          area: formData.address.area,
          city: formData.address.city,
          state: formData.address.state,
          landmark: formData.address.landmark,
          pincode: formData.address.pincode,
          country: formData.address.country || "India",
        },
      })


    try {
      const response = await apiClient.post("/user/update", {
        userId: user?.id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: {
          area: formData.address.area,
          city: formData.address.city,
          state: formData.address.state,
          landmark: formData.address.landmark,
          pincode: formData.address.pincode,
          country: formData.address.country || "India",
        },
      });

			console.log("res", response)

      if (response.ok) {
        toast.success(response.data.message || "Profile updated successfully!");
        setIsEditing(false);
        await fetchUserProfile();
      } else {
        toast.error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (userData) {
      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        phone: userData.phone || "",
        address: {
          area: userData.address?.area || "",
          city: userData.address?.city || "",
          state: userData.address?.state || "",
          landmark: userData.address?.landmark || "",
          pincode: userData.address?.pincode || "",
          country: userData.address?.country || "",
        },
      });
    }
  };

  const handleLogout = async () => {
    await logOut();
    toast.success("Logged out successfully");
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf4ea] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FAFAF6] flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-[#faf4ea] rounded-full flex items-center justify-center mx-auto mb-6">
            <FiUser className="text-[#c1552c] text-4xl" />
          </div>
          <h3 className="text-2xl font-bold text-[#2b1b12] mb-2">
            Please Login
          </h3>
          <p className="text-[#655849] mb-6">
            You need to be logged in to view your profile
          </p>
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-3 bg-[#c1552c] text-white rounded-xl font-semibold hover:bg-[#a84824] transition-colors cursor-pointer"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf4ea] font-serif py-8">
      <div className="max-w-4xl mx-auto px-4 lg:px-0">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#2b1b12]">My Profile</h1>
          <p className="text-[#655849]">Manage your account details</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-[#e6ded2] p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-[#faf4ea] rounded-full flex items-center justify-center mx-auto mb-4">
                  {userData?.profileImage ? (
                    <img
                      src={userData.profileImage}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <FaUserCircle className="text-6xl text-[#c1552c]" />
                  )}
                </div>
                <h3 className="font-bold text-[#2b1b12] text-lg">
                  {userData?.firstName} {userData?.lastName}
                </h3>
                <p className="text-sm text-[#655849]">{userData?.email}</p>
              </div>

              <div className="border-t border-[#e6ded2] pt-4 space-y-2">
                <button
                  onClick={() => router.push("/orders")}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[#655849] hover:bg-[#faf4ea] transition-colors cursor-pointer"
                >
                  <FiShoppingBag className="text-[#c1552c]" />
                  My Orders
                </button>
             
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <FiLogOut className="text-red-500" />
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-[#e6ded2] p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#2b1b12]">
                  Personal Information
                </h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 text-[#c1552c] hover:bg-[#faf4ea] rounded-xl transition-colors cursor-pointer"
                  >
                    <FiEdit2 />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 text-[#655849] hover:bg-[#faf4ea] rounded-xl transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <FiX />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-[#c1552c] text-white rounded-xl hover:bg-[#a84824] transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <FiSave />
                      Save
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#655849] mb-2">
                      First Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#faf4ea] border border-[#e6ded2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c1552c] text-[#2b1b12]"
                      />
                    ) : (
                      <p className="text-[#2b1b12] px-4 py-3 bg-[#faf4ea] rounded-xl">
                        {userData?.firstName || "Not set"}
                      </p>
                    )}
                    {errors.firstName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#655849] mb-2">
                      Last Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#faf4ea] border border-[#e6ded2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c1552c] text-[#2b1b12]"
                      />
                    ) : (
                      <p className="text-[#2b1b12] px-4 py-3 bg-[#faf4ea] rounded-xl">
                        {userData?.lastName || "Not set"}
                      </p>
                    )}
                    {errors.lastName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className=" text-sm font-medium text-[#655849] mb-2 flex items-center gap-2">
                      <FiMail className="text-[#c1552c]" />
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#faf4ea] border border-[#e6ded2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c1552c] text-[#2b1b12]"
                      />
                    ) : (
                      <p className="text-[#2b1b12] px-4 py-3 bg-[#faf4ea] rounded-xl">
                        {userData?.email || "Not set"}
                      </p>
                    )}
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className=" text-sm font-medium text-[#655849] mb-2 flex items-center gap-2">
                      <FiPhone className="text-[#c1552c]" />
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter 10-digit mobile number"
                        maxLength={10}
                        className="w-full px-4 py-3 bg-[#faf4ea] border border-[#e6ded2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c1552c] text-[#2b1b12]"
                      />
                    ) : (
                      <p className="text-[#2b1b12] px-4 py-3 bg-[#faf4ea] rounded-xl">
                        {userData?.phone || "Not set"}
                      </p>
                    )}
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Address Section */}
                <div className="border-t border-[#e6ded2] pt-6">
                  <h3 className="text-lg font-bold text-[#2b1b12] mb-4 flex items-center gap-2">
                    <FiMapPin className="text-[#c1552c]" />
                    Shipping Address
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-[#655849] mb-2">
                        Area / Street
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="address.area"
                          value={formData.address.area}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-[#faf4ea] border border-[#e6ded2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c1552c] text-[#2b1b12]"
                        />
                      ) : (
                        <p className="text-[#2b1b12] px-4 py-3 bg-[#faf4ea] rounded-xl">
                          {userData?.address?.area || "Not set"}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#655849] mb-2">
                        <MdOutlineLocationCity className="inline text-[#c1552c] mr-1" />
                        City
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="address.city"
                          value={formData.address.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-[#faf4ea] border border-[#e6ded2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c1552c] text-[#2b1b12]"
                        />
                      ) : (
                        <p className="text-[#2b1b12] px-4 py-3 bg-[#faf4ea] rounded-xl">
                          {userData?.address?.city || "Not set"}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#655849] mb-2">
                        State
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="address.state"
                          value={formData.address.state}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-[#faf4ea] border border-[#e6ded2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c1552c] text-[#2b1b12]"
                        />
                      ) : (
                        <p className="text-[#2b1b12] px-4 py-3 bg-[#faf4ea] rounded-xl">
                          {userData?.address?.state || "Not set"}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#655849] mb-2">
                        <MdOutlinePinDrop className="inline text-[#c1552c] mr-1" />
                        Pincode
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="address.pincode"
                          value={formData.address.pincode}
                          onChange={handleInputChange}
                          maxLength={6}
                          className="w-full px-4 py-3 bg-[#faf4ea] border border-[#e6ded2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c1552c] text-[#2b1b12]"
                        />
                      ) : (
                        <p className="text-[#2b1b12] px-4 py-3 bg-[#faf4ea] rounded-xl">
                          {userData?.address?.pincode || "Not set"}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#655849] mb-2">
                        Landmark
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="address.landmark"
                          value={formData.address.landmark}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-[#faf4ea] border border-[#e6ded2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c1552c] text-[#2b1b12]"
                        />
                      ) : (
                        <p className="text-[#2b1b12] px-4 py-3 bg-[#faf4ea] rounded-xl">
                          {userData?.address?.landmark || "Not set"}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#655849] mb-2">
                        Country
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="address.country"
                          value={formData.address.country}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-[#faf4ea] border border-[#e6ded2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c1552c] text-[#2b1b12]"
                        />
                      ) : (
                        <p className="text-[#2b1b12] px-4 py-3 bg-[#faf4ea] rounded-xl">
                          {userData?.address?.country || "India"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Account Info */}
                <div className="border-t border-[#e6ded2] pt-6">
                  <h3 className="text-lg font-bold text-[#2b1b12] mb-4">
                    Account Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-[#655849]">Account Type</p>
                      <p className="font-semibold text-[#2b1b12] capitalize">
                        {userData?.accountType || "Regular"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-[#655849]">Member Since</p>
                      <p className="font-semibold text-[#2b1b12]">
                        {userData?.createdAt
                          ? new Date(userData.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }
                            )
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}