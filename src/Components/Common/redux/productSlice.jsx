import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const initialState = {
  productData: [],
  favorites: [],
  returnRefund: [],
  compare: [],
  userInfo: {
    addresses: [],
    payments: [],
    defaultAdd: 0,
    defaultPay: 0,
  },
  selectedBook: [],
  selectedCollaborator: [],
  selectedEvent: [],
  collection: [],
  selectedPress: [],
  selectedReturnRefund: [],
  selectedLanguage:[{Language:'fr'}],
  selectedCurrency:[{currency:"eur"}],
  searchData: [],
  orderData: [],
};

export const productSlice = createSlice({
  name: "SofiaCo",
  initialState,
  reducers: {
    addInitialcart: (state, action)=>{
        state.productData.push(action.payload);
    }, 
    addTocart: (state, action) => {
        if (!state.userInfo) {
            toast.error(language === "eng" ? "Please log in to add items." : "Veuillez vous connecter pour ajouter des articles.", {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: 0,
                theme: "colored",
            });
            return;
        }
    
        const item = state.productData.find(item => item._id === action.payload._id);
        if (item) {
            // If item already exists in cart, update its quantity
            item.quantity = Number(item.quantity) + Number(action.payload.quantity) || Number(item.quantity) + 1; // Increment by 1 if no quantity specified
        } else {
            // If item doesn't exist in cart, add it
            state.productData.push(action.payload);
        }
    },
    editCart: (state, action) => {
      const item = state.productData.find(item => item._id === action.payload._id);
      if (item) {
          item.discount = Number(action.payload.discount) || item.discount;
      }
  },
    deleteItem: (state,action) => {
        state.productData = state.productData.filter(
            (item) => item._id !== action.payload
        )
            // console.log(state.productData);
    },
    resetCart: (state) => {
        state.productData = [];
    },
    increamentQuantity: (state, action) => {
        const item = 
        state.productData.find((item)=>item._id===action.payload._id);
        if (item) {
            item.quantity++;
        }
    },
    decreamentQuantity: (state, action) => {
        const item = 
        state.productData.find((item)=>item._id===action.payload._id);
        if (item) {
            item.quantity--;
        }
    },
    changeQuantity: (state, action) => {
      const item = state.productData.find((item) => item._id === action.payload._id);
      // console.log('testttt', item)
      if (item) {
          item.quantity = action.payload.quantity;
      }
  },
    addUser: (state, action) => {
      state.userInfo = {
        ...action.payload,
        addresses: action.payload.addresses ? [...action.payload.addresses] : [], // Copy the addresses array if it exists, otherwise use an empty array
        payments: action.payload.payments ? [...action.payload.payments] : [],
      };
    },
    editUser: (state, action) => {
      const { image, ...updatedFields } = action.payload;

      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          ...updatedFields,
          image: image || state.userInfo.image,
        },
      };
    },
    addAddress: (state, action) => {
      const newAddress = action.payload;

      // Check if userInfo and addresses array exist
      if (state.userInfo && state.userInfo.addresses) {
        // Add the new address to the addresses array
        state.userInfo.addresses.push(newAddress);
      }
    },
    editAddress: (state, action) => {
      const { addressId, formData } = action.payload;

      // Check if userInfo and addresses array exist
      if (state.userInfo && state.userInfo.addresses) {
        // Find the index of the address to be edited
        const addressIndex = state.userInfo.addresses.findIndex(
          (address) => address.id === addressId
        );

        // If the address is found, update it
        if (addressIndex !== -1) {
          state.userInfo.addresses[addressIndex] = {
            ...state.userInfo.addresses[addressIndex],
            ...formData,
          };
        }
      }
    },
    editDefaultAdd: (state, action) => {
      // Extract the new defaultAdd value from the action payload
      const newDefaultAdd = action.payload;

      // Check if userInfo exists
      if (state.userInfo) {
        // Update the defaultAdd value
        state.userInfo.defaultAdd = newDefaultAdd;
      }
    },
    deleteAddress: (state, action) => {
      state.userInfo.addresses = state.userInfo.addresses.filter(
        (item) => item.id !== action.payload
      );
    },
    resetAddresses: (state, action) => {
      state.userInfo.addresses = null;
    },
    addPayment: (state, action) => {
      const newPayment = action.payload;

      if (state.userInfo && state.userInfo.payments) {
        state.userInfo.payments.push(newPayment);
      }
    },
    editPayment: (state, action) => {
      const { paymentId, values } = action.payload;

      if (state.userInfo && state.userInfo.payments) {
        const paymentIndex = state.userInfo.payments.findIndex(
          (payment) => payment.id === paymentId
        );

        if (paymentIndex !== -1) {
          state.userInfo.payments[paymentIndex] = {
            ...state.userInfo.payments[paymentIndex],
            ...values,
          };
        }
      }
    },
    editDefaultPAY: (state, action) => {
      // Extract the new defaultAdd value from the action payload
      const newDefaultpay = action.payload;

      // Check if userInfo exists
      if (state.userInfo) {
        // Update the defaultAdd value
        state.userInfo.defaultPay = newDefaultpay;
      }
    },
    deletePayment: (state, action) => {
      state.userInfo.payments = state.userInfo.payments.filter(
        (item) => item.id !== action.payload
      );
    },
    removeUser: (state, action) => {
      state.userInfo = null;
      state.compare = [];
      state.favorites = [];
      state.productData = [];
    },

    addSelectedBook: (state, action) => {
      state.selectedBook = [];
      const book = action.payload;

      state.selectedBook.push(book);
    },

    deleteSelectedBook: (state) => {
      state.selectedBook = [];
    },

    changeLanguage: (state, action) => {
        state.selectedLanguage = []
        const language = action.payload;

            state.selectedLanguage.push(language);
    },
    changeCurrency: (state, action) => {
        state.selectedCurrency = []
        const currency = action.payload;

            state.selectedCurrency.push(currency);
    },

    addSelectedEvent: (state, action) => {
      state.selectedEvent = [];
      const event = action.payload;

      state.selectedEvent.push(event);
    },

    addSelectedPress: (state, action) => {
      state.selectedPress = [];
      const press = action.payload;

      state.selectedPress.push(press);
    },

    
    addSelectedReturnRefund: (state, action) => {
      state.selectedReturnRefund = [];
      const returnRefund = action.payload;

      state.selectedReturnRefund.push(returnRefund);
    },

    addSelectedCollab: (state, action) => {
      const collab = action.payload;

      state.selectedCollaborator.push(collab);
    },

    deleteSelectedCollab: (state) => {
      state.selectedCollaborator = [];
    },

    
    addTofavorite: (state, action)=>{
      if (!state.userInfo) {
          toast.error(language === "eng" ? "Please log in to add items." : "Veuillez vous connecter pour ajouter des articles.", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: 0,
          theme: "colored",
          });;
          return;
        } else {
      state.favorites.push(action.payload);
      }
  },
  increamentfavQuantity: (state, action) => {
      const item = 
      state.favorites.find((item)=>item._favid===action.payload._favid);
      if (item) {
          item.favquantity++;
      }
  },
  decreamentfavQuantity: (state, action) => {
      const item = 
      state.favorites.find((item)=>item._favid===action.payload._favid);
      if (item) {
          item.favquantity--;
      }
  },
  deletefavorite: (state,action) => {
      state.favorites = state.favorites.filter(
          (item) => item.id !== action.payload
      )
  },
  resetfavorite: (state) => {
      state.favorites = [];
  },
    changeFavorite: (state, action) => {
      const item = state.favorites.find(
        (item) => item._favid === action.payload._favid
      );
      if (item) {
        item.favquantity = action.payload.favquantity;
      }
    },
    addTocompare: (state, action) => {
      if (!state.userInfo) {
        toast.error(language === "eng" ? "Please log in to add items." : "Veuillez vous connecter pour ajouter des articles.", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: 0,
          theme: "colored",
        });
        return;
      } else {
        if (state.compare.length < 3) {
          state.compare.push(action.payload);
          // console.log(action.payload.comtitle);
          toast.success(
            `${
              action.payload.comtitle ? action.payload.comtitle : "Book"
            } is added`,
            {
              position: "top-right",
              autoClose: 1500,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: 0,
              theme: "colored",
            }
          );
        } else {
          toast.error(language === "eng" ? "Can't add more than 3." : "Impossible d'ajouter plus de 3.", {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: 0,
            theme: "colored",
          });
        }
      }
    },
    deletecompare: (state, action) => {
      state.compare = state.compare.filter(
        (item) => item._comid !== action.payload
      );
    },
    resetcompare: (state) => {
      state.compare = [];
    },
    addToreturnRefund: (state, action) => {
        state.returnRefund.push(action.payload);
    },
    editReturnRefund: (state, action) => {
      const { id, updatedData } = action.payload;
      const existingItemIndex = state.returnRefund.findIndex(
        (item) => item.id === id
      );

      if (existingItemIndex !== -1) {
        // If item exists, update the data
        state.returnRefund[existingItemIndex] = {
          ...state.returnRefund[existingItemIndex],
          ...updatedData,
        };
        toast.success(language === "eng" ? "Item updated with new data." : "Article mis à jour avec de nouvelles données.", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: 0,
          theme: "colored",
        });
      } else {
        // console.error("Item not found for editing.");
        toast.error(language === "eng" ? "Item not found for editing." : "Article non trouvé pour modification.");
      }
    },
    deletereturnRefund: (state, action) => {
      state.returnRefund = state.returnRefund.filter(
        (item) => item.id !== action.payload
      );
    },
    addCollection: (state, action) => {
      state.collection = [];
      state.collection.push(action.payload);
          
    },
    addSearchData: (state, action) => {
      if (state.searchData.length > 0) {
          const key = Object.keys(action.payload)[0]; // Get the first key dynamically
          const value = action.payload[key];
          
          let existingValues = 
          typeof state.searchData[0][key] === "string" 
              ? state.searchData[0][key].split("; ") 
              : [];

          if (existingValues.includes(value)) {
              // Remove the value if it exists
              existingValues = existingValues.filter(item => item !== value);
          } else {
              // Add the value if it doesn't exist
              existingValues.push(value);
          }
  
          // Update state: Add back if values exist, remove the key if empty
          if (existingValues.length > 0) {
              state.searchData[0] = { ...state.searchData[0], [key]: existingValues.join("; ") };
          } else {
              delete state.searchData[0][key];
          }
      } else {
          // If the array is empty, add a new object
          state.searchData.push(action.payload);
      }
  },

    // Edit function for editing an existing search data item
    editSearchData: (state, action) => {
        state.searchData = [action.payload];
    },
    
    resetSearchData: (state) => {
        state.searchData = [];
    },
    deleteSearchDataKey: (state, action) => {
      const { key, index } = action.payload;
  
      if (index !== undefined) {
          // Delete the key from the specific object at the given index
          if (state.searchData[index]) {
              delete state.searchData[index][key];
  
              // Check if the object is now empty and remove it
              if (Object.keys(state.searchData[index]).length === 0) {
                  state.searchData.splice(index, 1);
              }
          }
      } else {
          // Delete the key from all objects in the array
          state.searchData = state.searchData.filter(item => {
              delete item[key];
  
              // Return false to remove the object if it's empty
              return Object.keys(item).length > 0;
          });
      }
  },
    addOrderData: (state, action) => {
      state.orderData = []
      const data = action.payload;

          state.orderData.push(data);
  },
  resetOrderData: (state) => {
      state.orderData = []
  },
  },
});

export const {
  addTocart,
  editCart,
  deleteItem,
  addOrderData,
  resetOrderData,
  addSelectedEvent,
  resetCart,
  addSelectedCollab,
  deleteSelectedCollab,
  addSelectedBook,
  addSelectedPress,
  addSelectedReturnRefund,
  deleteSelectedBook,
  increamentQuantity,
  changeQuantity,
  addAddress,
  addPayment,
  decreamentQuantity,
  addUser,
  deleteAddress,
  resetAddresses,
  editUser,
  editAddress,
  editPayment,
  deletePayment,
  removeUser,
  addTofavorite,
  changeFavorite,
  increamentfavQuantity,
  decreamentfavQuantity,
  deletefavorite,
  resetfavorite,
  addTocompare,
  deletecompare,
  resetcompare,
  addToreturnRefund,
  editReturnRefund,
  deletereturnRefund,
  editDefaultAdd,
  editDefaultPAY,
  addCollection,
  addInitialcart,
  changeLanguage,
  changeCurrency, 
  addSearchData,
  editSearchData,
  resetSearchData,
} = productSlice.actions;
export default productSlice.reducer;
