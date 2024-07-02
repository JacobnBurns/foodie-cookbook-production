import { useEffect, useState } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import {useCookies} from 'react-cookie'

const API_URL = process.env.REACT_APP_API_URL;

export const Home = () => {
    const [recipes, setRecipes] = useState([]);
    const [savedRecipes, setSavedRecipes] = useState([]); 
    const [cookies, _] = useCookies(["access_token"]);

    const userID = useGetUserID();


    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await axios.get(`${API_URL}/recipes`);
                setRecipes(response.data);
            } catch (err) {
                console.error(err);
            }
        };
        const fetchSavedRecipes = async () => {
            try {
                const response = await axios.get(
                    `${API_URL}/recipes/savedRecipes/ids/${userID}`
                );
                setSavedRecipes(response.data.savedRecipes);
                
            } catch (err) {
                console.error(err);
            }
        };
 
        fetchRecipes();
        if (cookies.access_token) fetchSavedRecipes();
    }, [userID, cookies.access_token]);

    const saveRecipe = async (recipeID) => {
        try {
            const response = await axios.put(`${API_URL}/recipes`, {
                recipeID,
                userID,
            }, 
            {headers: {authorization: cookies.access_token}}
        );
            setSavedRecipes(response.data.savedRecipes);
        } catch (err) {
            console.error(err);
        }
    };

    const isRecipeSaved = (id) => savedRecipes.includes(id);

    return (
        <div>
            <h1>Recipes</h1>
            <ul>
                {recipes.map((recipe) => (
                    <li key={recipe._id}>
                        {/* {savedRecipes.includes(recipe._id) && <h2>Already Saved</h2>} */}
                        <div>
                            <h2>{recipe.name}</h2>
                            <button 
                                onClick={() => saveRecipe(recipe._id)}
                                disabled={isRecipeSaved(recipe._id)}
                            >
                                 {isRecipeSaved(recipe._id) ? "Saved" : "Save"}
                            </button>
                        </div>
                        <div className="instructions">
                            <p>{recipe.instructions}</p>
                        </div>
                        <img src={recipe.imageUrl} alt={recipe.name} />
                        <p>Cooking Time: {recipe.cookingTime} minutes</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};
