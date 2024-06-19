import React, { useState, useContext } from "react";
import "./ProfilePage.css";
import { AuthContext } from "../../context/auth.context";
import Loading from "../../components/Loading/Loading";
import Modal from "../../components/Modal/Modal";
import authService from "../../services/auth.service";
import PersonalForm from "../../components/Forms/PersonalForm";

function ProfilePage() {
  const { handleUserUpdate, user, setUser, setUserInStorage } =
    useContext(AuthContext);

  // Controls the editing of each element
  const [isEditingPersonalDetails, setIsEditingPersonalDetails] =
    useState(false);
  const [isEditingPaymentMethod, setIsEditingPaymentMethod] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [confirmAction, setConfirmAction] = useState("");

  // Subset of personalDetails in user context
  const userPersonalDetails = {
    name: user.name,
    lastName: user.lastName,
    email: user.email,
  };

  const userAddress = {
    address: user.address.address,
    city: user.address.city,
    region: user.address.region,
    zipCode: user.address.zipCode,
    country: user.address.country,
    phone: user.address.phone,
  };

  const userPaymentMethod = {
    method: user.paymentMethod.method,
    number: user.paymentMethod.number,
    expiration: user.paymentMethod.expiration,
    CVV: user.paymentMethod.CVV,
  };

  // 1 form for changes in personal , password, address, payment details
  const [formData, setFormData] = useState({});

  // Modal controls - component at bottom of page
  const [showModal, setShowModal] = useState(false);

  if (!user) {
    return <Loading />;
  }

  const alertIfOtherFormsOpen = () => {
    if (
      isEditingPersonalDetails ||
      isChangingPassword ||
      isEditingAddress ||
      isEditingPaymentMethod
    ) {
      alert("You must close the other forms before opening a new one");
      return true;
    }
  };

  const handleEditPersonalDetailsClick = () => {
    if (alertIfOtherFormsOpen()) return;
    setIsEditingPersonalDetails(true);
    setConfirmAction("personalDetails");
    setFormData({
      name: user.name,
      lastName: user.lastName,
      email: user.email,
    });
  };

  const handleEditAddressClick = () => {
    if (alertIfOtherFormsOpen()) return;
    setIsEditingAddress(true);
    setConfirmAction("address");
    setFormData({
      address: user.address.address || "",
      city: user.address.city || "",
      region: user.address.region || "",
      zipCode: user.address.zipCode || "",
      country: user.address.country || "",
      phone: user.address.phone || "",
    });
  };

  const handleEditPaymentMethodClick = () => {
    if (alertIfOtherFormsOpen()) return;
    setIsEditingPaymentMethod(true);
    setConfirmAction("paymentMethod");
    setFormData({
      method: user.paymentMethod.method || "",
      number: user.paymentMethod.number || "",
      expiration: user.paymentMethod.expiration || "",
      CVV: user.paymentMethod.CVV || "",
    });
  };

  const handleChangePasswordClick = () => {
    if (alertIfOtherFormsOpen()) return;
    setIsChangingPassword(true);
    setConfirmAction("password");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Go back button triggers modal - sends setIsEditing___ as a callback
  const handleGoBack = (newData, action) => {
    let changesInFields = {};

    if (action === "personalDetails") {
      changesInFields = getChangedFields(newData, userPersonalDetails);
    }
    if (action === "address") {
      changesInFields = getChangedFields(newData, userAddress);
    }
    if (action === "paymentMethod") {
      changesInFields = getChangedFields(newData, userPaymentMethod);
    }
    if (action === "password") {
      changesInFields = 1;
    }

    if (Object.keys(changesInFields).length !== 0) {
      setShowModal(true);
    } else {
      closeRelevantForm(action);
    }
  };

  const closeRelevantForm = (action) => {
    if (action === "personalDetails") {
      setIsEditingPersonalDetails(false);
      setConfirmAction("");
    }
    if (action === "address") {
      setIsEditingAddress(false);
      setConfirmAction("");
    }
    if (action === "paymentMethod") {
      setIsEditingPaymentMethod(false);
      setConfirmAction("");
    }
    if (action === "password") {
      setIsChangingPassword(false);
      setConfirmAction("");
    }
  };

  // Modal - When user clicks on confirmation, relevant editing field is closed
  const handleConfirm = (confirmAction) => {
    setShowModal(false);
    closeRelevantForm(confirmAction);
  };

  // Compares differing fields between user and formData and returns a new object
  const getChangedFields = (oldData) => {
    const changedFields = {};
    for (const key in oldData) {
      if (oldData[key] !== formData[key]) {
        changedFields[key] = formData[key];
      }
    }
    return changedFields;
  };

  const handlePersonalDetailsSubmit = (e) => {
    e.preventDefault();

    const changedFields = getChangedFields(userPersonalDetails, formData);
    if (Object.keys(changedFields).length > 0) {
      handleUserUpdate(changedFields, "personalDetails");
    }
    setIsEditingPersonalDetails(false);
    // Optionally update the user context here
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();

    const changedFields = getChangedFields(userAddress, formData);

    if (Object.keys(changedFields).length > 0) {
      handleUserUpdate(changedFields, "address");
      setIsEditingAddress(false);
    }
  };

  const handlePaymentMethodSubmit = (e) => {
    e.preventDefault();
    const changedFields = getChangedFields(userPaymentMethod, formData);

    if (Object.keys(changedFields).length > 0) {
      handleUserUpdate(changedFields, "paymentMethod");
      setIsEditingPaymentMethod(false);
    }
  };

  const handleChangePasswordSubmit = (e) => {
    e.preventDefault();
    // Submit the change password form data to the server
    setIsChangingPassword(false);
    // Optionally update the user context here
  };

  return (
    <div className="profile-page">
      <h1>Profile Page</h1>
      <div className="profile-columns">
        <div className="profile-column">
          <h2>Personal Details</h2>
          {isEditingPersonalDetails ? (
            <PersonalForm
              formData={formData}
              handleInputChange={handleInputChange}
              handlePersonalDetailsSubmit={handlePersonalDetailsSubmit}
              handleGoBack={handleGoBack}
              setIsEditingPersonalDetails={setIsEditingPersonalDetails}
              userPersonalDetails={userPersonalDetails}
            />
          ) : (
            <>
              <div className="profile-item">
                <strong>Name:</strong> {user.name}
              </div>
              <div className="profile-item">
                <strong>Last Name:</strong> {user.lastName}
              </div>
              <div className="profile-item">
                <strong>Email:</strong> {user.email}
              </div>
              {user.address && (
                <div className="profile-item">
                  <strong>Address:</strong> {user.address.address},{" "}
                  {user.address.city}, {user.address.region},{" "}
                  {user.address.zipCode}, {user.address.country},{" "}
                  {user.address.phone}
                </div>
              )}
              <button
                className="button-profile"
                onClick={handleEditPersonalDetailsClick}
              >
                Edit Personal Details
              </button>
            </>
          )}
          {isEditingAddress ? (
            <form onSubmit={handleAddressSubmit}>
              <div className="profile-item">
                <label>Address:</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>
              <div className="profile-item">
                <label>City:</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>
              <div className="profile-item">
                <label>Region:</label>
                <input
                  type="text"
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                />
              </div>
              <div className="profile-item">
                <label>Zip Code:</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                />
              </div>
              <div className="profile-item">
                <label>Country:</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                />
              </div>
              <div className="profile-item">
                <label>Phone:</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="button-group">
                <button className="button-profile" type="submit">
                  Save
                </button>
                <button
                  className="button-profile"
                  type="button"
                  onClick={() => handleGoBack(userAddress, "address")}
                >
                  Go Back Without Saving
                </button>
              </div>
            </form>
          ) : (
            <button className="button-profile" onClick={handleEditAddressClick}>
              Edit Address
            </button>
          )}

          {isEditingPaymentMethod ? (
            <form onSubmit={handlePaymentMethodSubmit}>
              <div className="profile-item">
                <label>Method:</label>
                <input
                  type="text"
                  name="method"
                  value={formData.method}
                  onChange={handleInputChange}
                />
              </div>
              <div className="profile-item">
                <label>Number:</label>
                <input
                  type="text"
                  name="number"
                  value={formData.number}
                  onChange={handleInputChange}
                />
              </div>
              <div className="profile-item">
                <label>Expiration:</label>
                <input
                  type="text"
                  name="expiration"
                  value={formData.expiration}
                  onChange={handleInputChange}
                />
              </div>
              <div className="profile-item">
                <label>CVV:</label>
                <input
                  type="text"
                  name="CVV"
                  value={formData.CVV}
                  onChange={handleInputChange}
                />
              </div>
              <div className="button-group">
                <button className="button-profile" type="submit">
                  Save
                </button>
                <button
                  className="button-profile"
                  type="button"
                  onClick={() =>
                    handleGoBack(userPaymentMethod, "paymentMethod")
                  }
                >
                  Go Back Without Saving
                </button>
              </div>
            </form>
          ) : (
            <button
              className="button-profile"
              onClick={handleEditPaymentMethodClick}
            >
              Edit Payment Method
            </button>
          )}
          {isChangingPassword ? (
            <form onSubmit={handleChangePasswordSubmit}>
              <div className="profile-item">
                <label>Current Password:</label>
                <input
                  type="password"
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleInputChange}
                />
              </div>
              <div className="profile-item">
                <label>New Password:</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                />
              </div>
              <div className="button-group">
                <button className="button-profile" type="submit">
                  Change Password
                </button>
                <button
                  className="button-profile"
                  type="button"
                  onClick={() => handleGoBack(undefined, "password")}
                >
                  Go Back Without Saving
                </button>
              </div>
            </form>
          ) : (
            <button
              className="button-profile"
              onClick={handleChangePasswordClick}
            >
              Change Password
            </button>
          )}
        </div>
        {(user.activeSubscription ||
          user.favDishes.length ||
          user.previousSubscriptions.length) && (
          <div className="profile-column">
            <h2>Activity</h2>
            {user.activeSubscription && (
              <div className="profile-item">
                <strong>Active Subscription:</strong>
                <div>
                  Shipping Address:{" "}
                  {user.activeSubscription.shippingAddress.address},{" "}
                  {user.activeSubscription.shippingAddress.city},{" "}
                  {user.activeSubscription.shippingAddress.region},{" "}
                  {user.activeSubscription.shippingAddress.zipCode},{" "}
                  {user.activeSubscription.shippingAddress.country},{" "}
                  {user.activeSubscription.shippingAddress.phone}
                </div>
                <div>
                  Meal Plan: {user.activeSubscription.mealPlan.diet.join(", ")}{" "}
                  for {user.activeSubscription.mealPlan.numberOfPeople} people,{" "}
                  {user.activeSubscription.mealPlan.dishesPerWeek} dishes/week,
                  ${user.activeSubscription.mealPlan.price}
                </div>
                <div>
                  Dishes:
                  <ul>
                    {user.activeSubscription.dishes.map((dish) => (
                      <li key={dish._id}>
                        <strong>{dish.name}</strong> - {dish.price}$
                        <div>
                          {dish.categories.origin.join(", ")},{" "}
                          {dish.categories.diet.join(", ")}, Cooking time:{" "}
                          {dish.cookingTime} minutes
                        </div>
                        <div>
                          Nutritional Value:{" "}
                          {dish.nutritionalValuePerServing.calories} calories,{" "}
                          {dish.nutritionalValuePerServing.fat}g fat,{" "}
                          {dish.nutritionalValuePerServing.protein}g protein,{" "}
                          {dish.nutritionalValuePerServing.carbohydrates}g
                          carbs, {dish.nutritionalValuePerServing.fiber}g fiber
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  Delivery Days:{" "}
                  {user.activeSubscription.deliveryDay.join(", ")}
                </div>
                <div>
                  Payment Method: {user.activeSubscription.paymentMethod.method}{" "}
                  ending in{" "}
                  {user.activeSubscription.paymentMethod.number.slice(-4)}, Exp:{" "}
                  {user.activeSubscription.paymentMethod.expiration}
                </div>
                <div>
                  Created At:{" "}
                  {new Date(user.activeSubscription.createdAt).toLocaleString()}
                </div>
                <div>
                  Updated At:{" "}
                  {new Date(user.activeSubscription.updatedAt).toLocaleString()}
                </div>
              </div>
            )}
            {user.favDishes.length > 0 && (
              <div className="profile-item">
                <strong>Fav Dishes:</strong>
                <ul>
                  {user.favDishes.map((dish) => (
                    <li key={dish._id}>
                      <strong>{dish.name}</strong> - {dish.price}$
                      <div>
                        {dish.categories.origin.join(", ")},{" "}
                        {dish.categories.diet.join(", ")}, Cooking time:{" "}
                        {dish.cookingTime} minutes
                      </div>
                      <div>
                        Nutritional Value:{" "}
                        {dish.nutritionalValuePerServing.calories} calories,{" "}
                        {dish.nutritionalValuePerServing.fat}g fat,{" "}
                        {dish.nutritionalValuePerServing.protein}g protein,{" "}
                        {dish.nutritionalValuePerServing.carbohydrates}g carbs,{" "}
                        {dish.nutritionalValuePerServing.fiber}g fiber
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {user.previousSubscriptions.length > 0 && (
              <div className="profile-item">
                <strong>Previous Subscriptions:</strong>
                {user.previousSubscriptions.map((subscription, index) => (
                  <div key={index}>
                    <div>Subscription ID: {subscription._id}</div>
                    <div>
                      Shipping Address: {subscription.shippingAddress.address},{" "}
                      {subscription.shippingAddress.city},{" "}
                      {subscription.shippingAddress.region},{" "}
                      {subscription.shippingAddress.zipCode},{" "}
                      {subscription.shippingAddress.country},{" "}
                      {subscription.shippingAddress.phone}
                    </div>
                    <div>
                      Meal Plan: {subscription.mealPlan.diet.join(", ")} for{" "}
                      {subscription.mealPlan.numberOfPeople} people,{" "}
                      {subscription.mealPlan.dishesPerWeek} dishes/week, $
                      {subscription.mealPlan.price}
                    </div>
                    <div>
                      Dishes:
                      <ul>
                        {subscription.dishes.map((dish) => (
                          <li key={dish._id}>
                            <strong>{dish.name}</strong> - {dish.price}$
                            <div>
                              {dish.categories.origin.join(", ")},{" "}
                              {dish.categories.diet.join(", ")}, Cooking time:{" "}
                              {dish.cookingTime} minutes
                            </div>
                            <div>
                              Nutritional Value:{" "}
                              {dish.nutritionalValuePerServing.calories}{" "}
                              calories, {dish.nutritionalValuePerServing.fat}g
                              fat, {dish.nutritionalValuePerServing.protein}g
                              protein,{" "}
                              {dish.nutritionalValuePerServing.carbohydrates}g
                              carbs, {dish.nutritionalValuePerServing.fiber}g
                              fiber
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      Delivery Days: {subscription.deliveryDay.join(", ")}
                    </div>
                    <div>
                      Payment Method: {subscription.paymentMethod.method} ending
                      in {subscription.paymentMethod.number.slice(-4)}, Exp:{" "}
                      {subscription.paymentMethod.expiration}
                    </div>
                    <div>
                      Created At:{" "}
                      {new Date(subscription.createdAt).toLocaleString()}
                    </div>
                    <div>
                      Updated At:{" "}
                      {new Date(subscription.updatedAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <Modal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleConfirm={handleConfirm}
        confirmAction={confirmAction}
        heading="Are you sure?"
        message="Your changes will be lost."
        confirmMessage="Yes"
        closeMessage="No"
      />
    </div>
  );
}

export default ProfilePage;
