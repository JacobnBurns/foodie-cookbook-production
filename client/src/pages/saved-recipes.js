import React, { useEffect, useState } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";

const API_URL = process.env.REACT_APP_API_URL;

export const SavedRecipes = () => {
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userID = useGetUserID();

    useEffect(() => {
        const fetchSavedRecipes = async () => {
            try {
                const response = await axios.get(
                    `${API_URL}/recipes/savedRecipes/${userID}`
                );
                setSavedRecipes(response.data.savedRecipes);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchSavedRecipes();
    }, [userID]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error fetching saved recipes: {error.message}</div>;
    }

    return (
        <div>
            <h1>Saved Recipes</h1>
            <ul>
                {savedRecipes.map((recipe) => (
                    <li key={recipe._id}>
                        <div>
                            <h2>{recipe.name}</h2>
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
