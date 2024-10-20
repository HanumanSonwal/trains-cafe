export const getVendorCategoriesAndMenuItems = async (vendorId, isVeg) => { 
    try {
        const response = await fetch(`/api/vendors/categories-menuItems/${vendorId}?veg=${isVeg}`);
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Error fetching vendor data:", error);
    }
}