import express from "express";
import mongoose from "mongoose";
import { RecipesModel } from "../models/Recipes.js";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./user.js"

const router = express.Router();

// GET request for all recipes
router.get("/", async (req, res) => {
    try {
        const recipes = await RecipesModel.find({});
        res.json(recipes);
    } catch(err) {
        console.error("Error fetching recipes:", err);
        res.status(500).json({ message: "Failed to retrieve recipes", error: err.message });
    }
});



// Create a new recipe
router.post("/", verifyToken, async (req, res) => {
    const recipe = new RecipesModel({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name, 
      image: req.body.image,
      ingredients: req.body.ingredients,
      instructions: req.body.instructions,
      imageUrl: req.body.imageUrl,
      cookingTime: req.body.cookingTime,
      userOwner: req.body.userOwner,
    });
    console.log(recipe);
  
    try {
      const result = await recipe.save();
      res.status(201).json({
        createdRecipe: {
          name: result.name,
          image: result.image,
          ingredients: result.ingredients,
          instructions: result.instructions,
          _id: result._id,
        },
      });
    } catch (err) {
      console.error("Error creating recipe:", err);
      res.status(500).json(err);
    }
  });

// GET recipe IDs
router.get("/savedRecipes/ids/:userID", async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userID);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ savedRecipes: user?.savedRecipes });
    } catch(err) {
        console.error("Error fetching saved recipe IDs:", err);
        res.status(500).json({ message: "Failed to retrieve saved recipe IDs", error: err.message });
    }
});
 
// Save a Recipe
router.put("/", verifyToken, async (req, res) => {
    const { recipeID, userID } = req.body;
    try {
        const recipe = await RecipesModel.findById(recipeID);
        const user = await UserModel.findById(userID);
        if (!recipe || !user) {
            return res.status(404).json({ message: "Recipe or user not found" });
        }
        user.savedRecipes.push(recipe._id);
        await user.save();
        res.json({ savedRecipes: user.savedRecipes });
    } catch (err) {
        console.error("Error saving recipe:", err);
        res.status(500).json({ message: "Failed to save recipe", error: err.message });
    }
});





// GET saved recipes
router.get("/savedRecipes/:userID", async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userID);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const savedRecipes = await RecipesModel.find({
            _id: { $in: user.savedRecipes },
        });
        res.json({ savedRecipes });
    } catch(err) {
        console.error("Error fetching saved recipes:", err);
        res.status(500).json({ message: "Failed to retrieve saved recipes", error: err.message });
    } 
});

export { router as recipesRouter };
