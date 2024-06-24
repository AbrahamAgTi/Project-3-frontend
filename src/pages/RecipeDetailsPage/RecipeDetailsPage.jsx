import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import { CartContext } from "../../context/cart.context";
import "./RecipeDetailsPage.css";
import "primeicons/primeicons.css"

const MONGO_URI = `${process.env.REACT_APP_SERVER_URL}/dishes` || "http://localhost:5005/dishes";
const USERMONGO_URI = `${process.env.REACT_APP_SERVER_URL}/users`;

function RecipeDetailsPage() {
  // Subscribe to the AuthContext to gain access to
  // the values from AuthContext.Provider's `value` prop
  const { isLoggedIn, user } = useContext(AuthContext);
  const { addToCart, mealPlan } = useContext(CartContext);

  const [recipe, setRecipe] = useState({});

  const navigate = useNavigate();

  // Obtain Id from URL
  const { recipeId } = useParams();

  // Get single recipe details
  useEffect(() => {
    axios
      .get(`${MONGO_URI}/${recipeId}`)
      .then((res) => {
        setRecipe(res.data);
      })
      .catch((err) => console.log(err));
  }, [recipeId]);

  const handleAddToFavorites = async () => {
    try {
      const response = await axios.post(
        `${USERMONGO_URI}/${user._id}/add-dishes`,
        { dishIds: [recipeId] }
      );
      if (response.status === 201) {
        alert("Recipe added to favorites!");

      }
    } catch (error) {
      console.error("Error adding recipe to favorites:", error);

    }
  };




  // Handler function to add the current recipe to the cart
  const handleAddToCart = (recipe) => {
    if (!mealPlan || !mealPlan.dishesPerWeek) {
      navigate("/mealplan");
    } else {
      addToCart(recipe);
    }
  };

  return (

    <div className="recipe-details">
      <h1>{recipe.name}</h1>
      <div className="first-recipe-section">
        <img src={`/${recipe.name}.jpg`} alt={recipe.name}></img>
        <div className="recipe-basic-info">
          <p><span className="pi pi-stopwatch" /> Cooking Time {recipe.cookingTime}'</p>
          <p>Rating {recipe.rating} <span className="pi pi-star-fill" /></p>
          <p>Difficulty: {recipe.difficulty}</p>
        </div>
        {isLoggedIn && mealPlan && mealPlan.dishesPerWeek ? (
          <button
            className="subscription-button"
            onClick={() => handleAddToCart(recipe)}
          >
            Add to Subscription
          </button>
        )
          : (<button
            className="subscription-button"
            onClick={() => navigate("/mealplan")}
          >
            Start Subscription
          </button>
          )}

        {isLoggedIn && (
          <button
            className="favorite-button"
            onClick={handleAddToFavorites}
          >
            Add to Favorites
          </button>
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
      {/* Obtain Nutritional Information from Object */}
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
