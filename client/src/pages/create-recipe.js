import React, { useState } from 'react';
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import { useNavigate } from "react-router-dom"
import { useCookies } from 'react-cookie';

const API_URL = process.env.REACT_APP_API_URL;

export const CreateRecipe = () => {
    const userID = useGetUserID();
    const [cookies, _] = useCookies(["access_token"]);

    const [recipe, setRecipe] = useState ({
        name:"",
        // description: "",
        ingredients: [],
        instructions: "",
        imageUrl: "",
        cookingTime: 0,
        userOwner: userID,

    });
 
const navigate = useNavigate()

    const handleChange = (event) => {
        const { name, value } = event.target;
        setRecipe({...recipe, [name]: value});
    };

    const handleIngredientChange = (event, index) => {
        const { value } = event.target;
        const ingredients = recipe.ingredients;
        ingredients[index]= value;
        setRecipe({...recipe, ingredients  });
    };
  
    const handleAddIngredient = () => {
        setRecipe({ ...recipe, ingredients: [...recipe.ingredients,""] });
      };
 
    const handleSubmit = async (event) => {
        event.preventDefault();
        try{
            await axios.post(`${API_URL}/recipes`, recipe,{
                headers: {authorization: cookies.access_token},
            });
            alert("Recipe has been created");
            navigate("/")
        }catch (error) {
            console.error(error);
        }
    };

    return (
        <div className ="create-recipe">
            <h2> Create Recipe</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Name</label>
                <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    onChange={handleChange} 
                />
{/*    
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    value={recipe.description}
                    onChange={handleChange}
                ></textarea> */}

                <label htmlFor="ingredients">Ingredients</label>
                    {recipe.ingredients.map((ingredient, index) => (
                    <input
                        key={index}
                        type="text"
                        name="ingredients"
                        value={ingredient}
                        onChange={(event) => handleIngredientChange(event, index)}
                    /> 
                    ))}
                <button type="button" onClick={handleAddIngredient}>
                    Add Ingredient
                </button>

                <label htmlFor="instructions">instructions</label>
                <textarea 
                    id="instructions" 
                    name="instructions" 
                    onChange={handleChange}
                ></textarea>

                <label htmlFor="imageUrl">ImageUrl</label>
                <input
                    type="text" 
                    id="imageUrl" 
                    name="imageUrl" 
                    onChange={handleChange} 
                />

                <label htmlFor="cookingTime">Cooking Time (minutes)</label>
                <input type="number"
                    id="cookingTime" 
                    name="cookingTime" 
                    onChange={handleChange}
                />
                <button type="submit">Create Recipe</button>
            </form>
        </div>
    );
 }; 