import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import { CartContext } from "../../context/cart.context";
import "./RecipeDetailsPage.css";
import "primeicons/primeicons.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IconButton } from "@mui/material";
import { Bookmark, BookmarkBorder } from "@mui/icons-material";

function RecipeDetailsPage() {
  const {
    isLoggedIn,
    user,
    loadAllUserData,
    isInFavorites,
    handleToggleFavorite,
    isFavDishUpdating,
  } = useContext(AuthContext);
  const { addToCart, mealPlan, recipes } = useContext(CartContext);

  const [recipe, setRecipe] = useState({});
  const navigate = useNavigate();
  const { recipeId } = useParams();

  useEffect(() => {
    if (user && Object.keys(user).length === 6) loadAllUserData();
    // find dish in dishes array by id
    const dish = recipes.find((dish) => dish._id === recipeId);
    setRecipe(dish);

    return () => {
      isFavDishUpdating();
    };
  }, [recipeId]);

  const handleAddToCart = (recipe) => {
    if (!mealPlan || !mealPlan.dishesPerWeek) {
      navigate("/mealplan");
    } else {
      addToCart(recipe);
      toast.success("Dish added to the cart!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  return (
    <div className="recipe-details">
      <ToastContainer />

      <h1>{recipe.name}</h1>
      <div className="first-recipe-section">
        <img src={`/${recipe.name}.jpg`} alt={recipe.name}></img>
        <div className="recipe-basic-info">
          <p>
            <span className="pi pi-stopwatch" /> Cooking Time{" "}
            {recipe.cookingTime}'
          </p>
          <p>
            Rating {recipe.rating} <span className="pi pi-star-fill" />
          </p>
          <p>Difficulty: {recipe.difficulty}</p>
        </div>
        {isLoggedIn && mealPlan && mealPlan.dishesPerWeek ? (
          <button
            className="subscription-button"
            onClick={() => handleAddToCart(recipe)}
          >
            Add to cart
          </button>
        ) : (
          <button
            className="subscription-button"
            onClick={() => navigate("/mealplan")}
          >
            Start Subscription
          </button>
        )}

        {isLoggedIn && (
          <IconButton
            className="favorite-button"
            onClick={handleToggleFavorite}
          >
            {isInFavorites(recipe.id) ? <Bookmark /> : <BookmarkBorder />}
          </IconButton>
        )}
      </div>
      <div className="recipe-tags">
        {recipe.categories && (
          <>
            {recipe.categories.origin.map((origin, index) => (
              <p key={`origin-${index}`}>{origin}</p>
            ))}
            {recipe.categories.diet.map((diet, index) => (
              <p key={`diet-${index}`}>{diet}</p>
            ))}
          </>
        )}
      </div>
      <div className="recipe-ingredients-container">
        <h2>Ingredients</h2>
        <ul className="ingredients-list">
          {recipe.ingredients &&
            recipe.ingredients.map((ingredient, index) => (
              <li key={`ingredient-${index}`}>{ingredient}</li>
            ))}
        </ul>
      </div>
      {recipe.nutritionalValuePerServing && (
        <div className="nutritional-information-table">
          <h2>Nutritional Information</h2>
          <table>
            <tbody>
              <tr>
                <th>Calories</th>
                <td>{recipe.nutritionalValuePerServing.calories}kcal</td>
              </tr>
              <tr>
                <th>Protein</th>
                <td>{recipe.nutritionalValuePerServing.protein}g</td>
              </tr>
              <tr>
                <th>Carbohydrates</th>
                <td>{recipe.nutritionalValuePerServing.carbohydrates}g</td>
              </tr>
              <tr>
                <th>Fat</th>
                <td>{recipe.nutritionalValuePerServing.fat}g</td>
              </tr>
              <tr>
                <th>Fiber</th>
                <td>{recipe.nutritionalValuePerServing.fiber}g</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      {recipe.steps && (
        <div className="recipe-steps-container">
          <h2>Step-by-step</h2>
          <ul className="recipe-steps">
            {recipe.steps.map((step, index) => (
              <li key={`step-${index}`}>
                <span>
                  <b>Step {index + 1}</b> {step}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default RecipeDetailsPage;
