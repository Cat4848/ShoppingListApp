window.onload = addToListButtonEventHandler;

function addToListButtonEventHandler() {
    let button = document.getElementById("add-to-list-button");
    let inputEl = document.getElementById("shopping-list-input");
    button.onclick = userInputValidation;

    inputEl.onkeydown = function(event) {
        if (event.key === "Enter") {
        button.click();
        };
    };
};   

const recipesIngredients = {
    lasagne: "2 tbsp olive oil, plus a little for the dish 750g lean beef mince 90g pack prosciutto tomato sauce 200ml hot beef stock a little grated nutmeg 300g pack fresh lasagne sheets white sauce 125g ball mozzarella, torn into thin strips",

    paella: "20-24 raw shell-on king prawns 2 tbsp olive oil 500g monkfish, cut into chunks 1 large onion, finely chopped 500g paella rice 4 garlic cloves, sliced 2 tsp smoked paprika 1 tsp cayenne pepper (optional) one pinch of saffron ½ x 400g can chopped tomatoes (save the rest for the stock, below) 500g mussels, cleaned 100g frozen peas 100g frozen baby broad beans handful parsley leaves, roughly chopped" 
};

let shoppingListItems = [];   

function userInputValidation() {
    const newListItem = document.getElementById("shopping-list-input");
    const newListItemValue = newListItem.value;
    const shoppingListDisplayContainer = document.getElementById("shopping-list-display-container");

    if (newListItemValue === "" || newListItemValue.match(/\d+/gi) || newListItemValue.match(/s$/gi)) {
        document.getElementById("alert-inactive").appendChild(createShoppingListAlert());
    } else {
        const listItemElement = shoppingListDisplayContainer.appendChild(createShoppingListItem(newListItemValue, newListItem));                       
        listItemElement.appendChild(createDeleteButton());                       
        listItemElement.appendChild(createTickButton());     
        domElementsReadingUpdate();               
    };
};

function domElementsReadingUpdate() {
    const deleteButtons = document.getElementsByClassName("deleteButton");
    const tickButtons = document.getElementsByClassName("tickButton");

    assignDeleteButtonsEvent(deleteButtons);
    assignTickButtonsEvent(tickButtons);
};

function checkIfGenerateButtonCanChangeClass() {
    const generateButton = document.getElementById("generate-button");

    shoppingListItems.length < 10 ? generateButton.className = "generate-button-inactive" : generateButton.className = "generate-button-active";
};

function createShoppingListAlert() {
    let alert = document.createElement("div");
    alert.setAttribute("id", "alert");
    alert.textContent = "Please enter a valid shopping list item";
    return alert;
};

function createShoppingListItem(newListItemValue, newListItem) {
    const p = document.createElement("div");
    p.setAttribute("class", "inputValue");
    p.textContent = newListItemValue;
    shoppingListItems.push(newListItemValue.toLowerCase());

    newListItem.value = "";
    newListItem.focus();

    generateButtonEventHandler();
    checkIfGenerateButtonCanChangeClass();
    return p;
};

function createDeleteButton() {
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("class", "deleteButton");

    const deleteButtonIcon = document.createElement("i");
    deleteButtonIcon.setAttribute("class", "fa-solid fa-trash-can fa-fw");
    deleteButton.appendChild(deleteButtonIcon);

    return deleteButton;
};

function createTickButton() {
    const tickButton = document.createElement("button");
    tickButton.setAttribute("class", "tickButton");
    tickButton.textContent = "Done";

    const tickButtonIcon = document.createElement("i");
    tickButtonIcon.setAttribute("class", "fa-solid fa-check fa-fw");

    tickButton.appendChild(tickButtonIcon);
    return tickButton;
};

function assignDeleteButtonsEvent(deleteButtons) {
    for (let i = 0; i < deleteButtons.length; i++) {
        deleteButtons[i].onclick = function() {
            this.parentElement.remove();

            shoppingListItems.splice(i, 1);

            domElementsReadingUpdate();
            checkIfGenerateButtonCanChangeClass();
        };         
    };
};

function assignTickButtonsEvent(tickButtons) {
    for (let i = 0; i < tickButtons.length; i++) {
        tickButtons[i].onclick = function() {
            this.parentElement.style.textDecoration = "line-through";  
        };
    };
};

function generateButtonEventHandler() {
    let matchingIngredients = [];
    let recipesList = [];

    const generateButton = document.getElementById("generate-button");
    generateButton.onclick = function() {
         console.log("1");
         if (generateButton.className === "generate-button-active") {
             console.log("here")
             //only use this feature if there are at least a certain number of items on shopping list items array
             for (let[key, value] of Object.entries(recipesIngredients)) {
                 //if the user's shopping list items are included in the recipes DB, then store the recipes names                
                 for (let i = 0; i < shoppingListItems.length; i++) {
                     if (value.includes(shoppingListItems[i])) {
                         matchingIngredients.push(shoppingListItems[i]);
                         recipesList.push(key);
                     };
                 };
             };
         };
     
    countHowManyIngredientsMatchInEachRecipe(recipesList);
    };                     
};

function countHowManyIngredientsMatchInEachRecipe(recipesList) {
    let counter = {};

    for (const value of recipesList) {
        //count how many ingredients are part of the recipes based on user's input    
        if (counter[value]) {
            counter[value]++;
        } else {
            counter[value] = 1;
        };
    };   
    selectRecipesForDisplay(counter);     
};

function selectRecipesForDisplay(counter) {
    let recipesForDisplay = [];
    const minNoOfRecipeCount = 6;

    for (let[key, value] of Object.entries(counter)) {
        //if a recipe has a certain number of ingredinets contained in the user's shopping list, then display those recipes
        if (value >= minNoOfRecipeCount) {
            recipesForDisplay.push(key);
        };                                
    };
    displayMatchedRecipe(recipesForDisplay);     
};

function displayMatchedRecipe (recipesForDisplay) {
    console.log(recipesForDisplay);
    const [recipe1, recipe2] = recipesForDisplay;

    const recipesContainer = document.getElementById("recipes-container");
    recipesContainer.appendChild(createMatchedRecipeElements(recipe1));

    if (recipesForDisplay.length > 1) {
        recipesContainer.appendChild(createMatchedRecipeElements(recipe2));
    };

    const contentContainerMatchedRecipe = document.getElementsByClassName("content");

    for (let i = 0; i < contentContainerMatchedRecipe.length; i++) {
        if (recipesForDisplay[i] === "lasagne") {
            contentContainerMatchedRecipe[i].appendChild(lasagneRecipeDisplay());
        };

        if (recipesForDisplay[i] === "paella") {
            contentContainerMatchedRecipe[i].appendChild(paellaRecipeDisplay());
        };
    };

    collapseRecipeDisplayContainer();
};    

function createMatchedRecipeElements(recipeName) {
    const recipeContainer = document.createElement("div");

    const recipeButton = document.createElement("button");
    recipeButton.setAttribute("class", "collapseButton");
    recipeButton.innerHTML = recipeName[0].toUpperCase() + recipeName.slice(1);
        
    const recipeContent = document.createElement("div");
    recipeContent.setAttribute("class", "content");                
        
    recipeContainer.appendChild(recipeButton);
    recipeContainer.appendChild(recipeContent);
    return recipeContainer;
};

function collapseRecipeDisplayContainer() {
    //add event listner to the button for opening up the collapsible
    const collapseButtons = document.getElementsByClassName("collapseButton"); 
        
    for (let i = 0; i < collapseButtons.length; i++) {
        collapseButtons[i].onclick = function() {
            const content = this.nextElementSibling;
            content.className === "content" ? content.className = "collapse" : content.className = "content";

            this.className === "collapseButton" ? this.className = "active" : this.className = "collapseButton";
        };
    };
};

//recipes display functions
const lasagneRecipeDisplay = (function() {
    let executed = false;

    return function () {
        if (!executed) {
            executed = true;
            
            const recipeData = {
                name: "Classic Lasagne Recipe",
                "overview data": {
                    "cooking time": "Cook: 2 hours",
                    "difficulty": "Easy",
                    "no. of people serving from recipe quantities": "Serves 6"
                },
                "imgage source": "http://drive.google.com/uc?export=view&id=1Rf5L0d6Wm2Pa9hlDCa3i5PC8fO-kNLAG",
                "image alt": "cooked lasagne on a white plate",
                "short description": "Prepare this easy lasagne ahead of time and save in the freezer, uncooked, for when you need it during a busy week. Then just bake for an extra 45 mins.",
                "nutrition facts": {
                    "kcal": "580",
                    "fat": "32g",
                    "saturates": "14g",
                    "carbs": "31g",
                    "sugars": "8g",
                    "fibre": "3g",
                    "protein": "44g",
                    "salt": "1.71g"
                },
                "Ingredients": [
                    "2 olive oil, plus a little for the dish", "750g lean beef mince", "90g pack prosciutto", "tomato sauce", "200ml hot beef stock", "a little grated nutmeg", "300g pack fresh lasagne sheets", "white sauce", "125g ball mozzarella, torn into thin strips"
                ],
                preparation: {
                    "STEP 1": "To make the meat sauce, heat 2 tbsp olive oil in a frying pan and cook 750g lean beef mince in two batches for about 10 mins until browned all over.",
                    "STEP 2": "Finely chop 4 slices of prosciutto from a 90g pack, then stir through the meat mixture.",
                    "STEP 3": "Pour over 800g passata or half our basic tomato sauce recipe and 200ml hot beef stock. Add a little grated nutmeg, then season.",
                    "STEP 4": "Bring up to the boil, then simmer for 30 mins until the sauce looks rich.",
                    "STEP 5": "Heat oven to 180C/fan/160C/gas 4 and lightly oil an ovenproof dish (about 30 x 20cm).",
                    "STEP 6": "Spoon one third of the meat sauce into the dish, then cover with some fresh lasagne sheets from a 300g pack. Drizzle over roughly 130g ready-made or homemade white sauce.",
                    "STEP 7": "Repeat until you have 3 layers of pasta. Cover with the remaining 390g white sauce, making sure you can't see any pasta poking through.",
                    "STEP 8": "Scatter 125g torn mozzarella over the top.",
                    "STEP 9": "Arrange the rest of the prosciutto on top. Bake for 45 mins until the top is bubbling and lightly browned."
                },
            };
            
            function createRecipeTitle(recipeData) {
                const title = document.createElement("h2");
                title.innerHTML = recipeData.name;
                return title;
            };
            
            function createRecipeOverviewData(recipeData) {
                const recipeOverviewDataContainer = document.createElement("div");
                recipeOverviewDataContainer.setAttribute("id", "recipe-overview-data-container");
                recipeOverviewDataContainer.setAttribute("class", "container");
            
                const ulElement = document.createElement("ul");
            
                for (let i = 0; i < Object.keys(recipeData["overview data"]).length; i++) {
                    const liElement = document.createElement("li");
                    liElement.innerHTML = Object.values(recipeData["overview data"])[i];
            
                    const fontAwsomeClasses = ["fa-solid fa-clock", "fa-solid fa-draw-polygon", "fa-solid fa-utensils"];
            
                    for (let j = 0; j < 1; j++) {
                        const fontAwsomeIcon = document.createElement("i");
                        fontAwsomeIcon.setAttribute("class", `${fontAwsomeClasses[i]}`);
                        liElement.appendChild(fontAwsomeIcon);
                    };
            
                    ulElement.appendChild(liElement);
                };
                recipeOverviewDataContainer.appendChild(ulElement);
                return recipeOverviewDataContainer;
            };
            
            function createRecipeImage(recipeData) {
                const img = document.createElement("img");
                img.src = recipeData["imgage source"];
                img.alt = recipeData["image alt"];
                return img;
            };
            
            function createRecipeShortDescription(recipeData) {
                const paragraph = document.createElement("p");
                paragraph.innerHTML = recipeData["short description"];
                return paragraph;
            };
            
            function createNutritionFacts(recipeData) {
                //the table has 2 rows. each row containing 8 cells
                const nutritionFactsTable = document.createElement("table");
            
                for (let i = 0; i < 1; i++) {
                    const row = document.createElement("tr");
                    for (let j= 0; j < 8; j++) {
                        const cell = document.createElement('td');
                        cell.innerHTML = Object.keys(recipeData["nutrition facts"])[j];
                        row.appendChild(cell);
                    };
                    nutritionFactsTable.appendChild(row);
                };
            
                for (let i = 0; i < 1; i++) {
                    const row = document.createElement("tr");
                    for (let j= 0; j < 8; j++) {
                        const cell = document.createElement('td');
                        cell.setAttribute("id", "nutritionFactsFigures");
                        cell.innerHTML = Object.values(recipeData["nutrition facts"])[j];
                        row.appendChild(cell);
                    };
                    nutritionFactsTable.appendChild(row);
                };
                return nutritionFactsTable;
            };
            
            function createIngredientsSection(recipeData) {
                const container = document.createElement("div");
                container.setAttribute("class", "container");
            
                const title = document.createElement("h4");
                title.innerHTML = "Ingredients";
            
                container.appendChild(title);
            
                const ulElement = document.createElement("ul");
            
                for (let i = 0; i < recipeData["Ingredients"].length; i++) {
                    const liElement = document.createElement("li");
                    liElement.innerHTML = recipeData["Ingredients"][i];
                    ulElement.appendChild(liElement);
                };
                container.appendChild(ulElement);
                return container;
            };
            
            function createPreparationSection(recipeData) {
                const container = document.createElement("div");
                container.setAttribute("class", "container");
            
                const title = document.createElement("h4");
                title.innerHTML = "Preparation";
            
                container.appendChild(title);
            
                for (let i = 0; i < Object.keys(recipeData.preparation).length; i++) {
                    const preparationStep = document.createElement("h3");
                    preparationStep.innerHTML = Object.keys(recipeData.preparation)[i];
            
                    const preparationDetails = document.createElement("p");
                    preparationDetails.innerHTML = Object.values(recipeData.preparation)[i];
                    
                    container.appendChild(preparationStep);
                    container.appendChild(preparationDetails);
                };
                return container;
            };
            
            const recipeDisplayContainer = document.createElement("div");
            recipeDisplayContainer.appendChild(createRecipeTitle(recipeData));
            recipeDisplayContainer.appendChild(createRecipeOverviewData(recipeData));
            recipeDisplayContainer.appendChild(createRecipeImage(recipeData));
            recipeDisplayContainer.appendChild(createRecipeShortDescription(recipeData));
            recipeDisplayContainer.appendChild(createNutritionFacts(recipeData));
            recipeDisplayContainer.appendChild(createIngredientsSection(recipeData));
            recipeDisplayContainer.appendChild(createPreparationSection(recipeData));
        
            return recipeDisplayContainer;
        };
    };
})();

function paellaRecipeDisplay() {
    const recipeData = {
        name: "Seafood Paella Recipe",
        "overview data": {
            "cooking time": "Cook: 1 hour and 10 minutes",
            "difficulty": "More effort",
            "no. of people serving from recipe quantities": "Serves 8"
        },
        "imgage source": "http://drive.google.com/uc?export=view&id=1YzgPLY6xLJN46_NxNwaKRGncov7ly0wz",
        "image alt": "cooked paella on a wok",
        "short description": "This impressive Spanish one pot, with monkfish, king prawns and mussels, is perfect for feeding a crowd at a dinner party.",
        "nutrition facts": {
            "kcal": "384",
            "fat": "6g",
            "saturates": "1g",
            "carbs": "54g",
            "sugars": "5g",
            "fibre": "5g",
            "protein": "26g",
            "salt": "1.5g"
        },
        "For the Stock": [
            "1 tbsp olive oil", "1 onion, roughly chopped", "½ x 400g can chopped tomatoes", "6 garlic cloves, roughly chopped", "1 chicken stock cube", "1 star anise"
        ],
        "Ingredients": [
            "20-24 raw shell-on king prawns", "750g lean beef mince2 tbsp olive oil", "500g monkfish, cut into chunks", "1 large onion, finely chopped", "500g paella rice", "4 garlic cloves, sliced", "2 tsp smoked paprika", "1 tsp cayenne pepper (optional)", "pinch of saffron", "½ x 400g can chopped tomatoes", "500g mussels, cleaned", "100g frozen peas", "100g frozen baby broad beans", "handful parsley leaves, roughly chopped"
        ],
        preparation: {
            "STEP 1": "Peel and de-vein the prawns, reserving the heads and shells. Return the prawns to the fridge.",
            "STEP 2": "To make the stock, heat the oil in a large pan over a medium-high heat and add the onion, tomatoes, garlic, and reserved prawn shells and heads. Cook for 3-4 mins, then pour in 2 litres of water and add the stock cube and star anise. Bring to a boil, then simmer for 30 mins. Leave to cool slightly, then whizz in batches in a blender or food processor. Strain through a fine sieve.",
            "STEP 3": "Heat the oil in a large paella pan or an extra-large frying pan. Brown the monkfish for a few mins each side, then remove and set aside. Add the onion and fry for 4-5 mins until softened.",
            "STEP 4": "Stir in the rice and cook for 30 secs to toast. Add the garlic, paprika, cayenne (if using) and saffron, cook for another 30 secs, then stir in the tomatoes and 1.5 litres of the fish stock. Bring to the boil, then turn down to a simmer and cook, stirring, for about 10 mins (the rice should still be al dente). Return the monkfish to the pan with the prawns, mussels, peas and broad beans.",
            "STEP 5": "Cover the pan with a large baking tray, or foil, and cook on a low heat for another 10-15 mins until the mussels are open and the prawns are cooked through. Scatter over the parsley before serving."
        },
    };
    
    function createRecipeTitle(recipeData) {
        const title = document.createElement("h2");
        title.innerHTML = recipeData.name;
        return title;
    };
    
    function createRecipeOverviewData(recipeData) {
        const recipeOverviewDataContainer = document.createElement("div");
        recipeOverviewDataContainer.setAttribute("id", "recipe-overview-data-container");
        recipeOverviewDataContainer.setAttribute("class", "container");
    
        const ulElement = document.createElement("ul");
    
        for (let i = 0; i < Object.keys(recipeData["overview data"]).length; i++) {
            const liElement = document.createElement("li");
            liElement.innerHTML = Object.values(recipeData["overview data"])[i];
    
            const fontAwsomeClasses = ["fa-solid fa-clock", "fa-solid fa-draw-polygon", "fa-solid fa-utensils"];
    
            for (let j = 0; j < 1; j++) {
                const fontAwsomeIcon = document.createElement("i");
                fontAwsomeIcon.setAttribute("class", `${fontAwsomeClasses[i]}`);
                liElement.appendChild(fontAwsomeIcon);
            };
    
            ulElement.appendChild(liElement);
        };
        recipeOverviewDataContainer.appendChild(ulElement);
        return recipeOverviewDataContainer
    };
    
    function createRecipeImage(recipeData) {
        const img = document.createElement("img");
        img.src = recipeData["imgage source"];
        img.alt = recipeData["image alt"];
        return img;
    };
    
    function createRecipeShortDescription(recipeData) {
        const paragraph = document.createElement("p");
        paragraph.innerHTML = recipeData["short description"];
        return paragraph;
    };
    
    function createNutritionFacts(recipeData) {
        //the table has 2 rows. each row containing 8 cells
        const nutritionFactsTable = document.createElement("table");
    
        for (let i = 0; i < 1; i++) {
            const row = document.createElement("tr");
            for (let j= 0; j < 8; j++) {
                const cell = document.createElement('td');
                cell.innerHTML = Object.keys(recipeData["nutrition facts"])[j];
                row.appendChild(cell);
            };
            nutritionFactsTable.appendChild(row);
        };
    
        for (let i = 0; i < 1; i++) {
            const row = document.createElement("tr");
            for (let j= 0; j < 8; j++) {
                const cell = document.createElement('td');
                cell.setAttribute("id", "nutritionFactsFigures");
                cell.innerHTML = Object.values(recipeData["nutrition facts"])[j];
                row.appendChild(cell);
            };
            nutritionFactsTable.appendChild(row);
        };
        return nutritionFactsTable;
    };
    
    function createIngredientsSection(recipeData) {
        const container = document.createElement("div");
        container.setAttribute("class", "container");
    
        const title = document.createElement("h4");
        title.innerHTML = "Ingredients";
    
        container.appendChild(title);
    
        const ulElement = document.createElement("ul");
    
        for (let i = 0; i < recipeData["Ingredients"].length; i++) {
            const liElement = document.createElement("li");
            liElement.innerHTML = recipeData["Ingredients"][i];
            ulElement.appendChild(liElement);
        };
        container.appendChild(ulElement);
        return container;
    };

    function createStockSection(recipeData) {
        const container = document.createElement("div");
        container.setAttribute("class", "container");
    
        const title = document.createElement("h4");
        title.innerHTML = "For the Stock";
    
        container.appendChild(title);
    
        const ulElement = document.createElement("ul");
    
        for (let i = 0; i < recipeData["For the Stock"].length; i++) {
            const liElement = document.createElement("li");
            liElement.innerHTML = recipeData["For the Stock"][i];
            ulElement.appendChild(liElement);
        };
        container.appendChild(ulElement);
        return container;
    };
    
    function createPreparationSection(recipeData) {
        const container = document.createElement("div");
        container.setAttribute("class", "container");
    
        const title = document.createElement("h4");
        title.innerHTML = "Preparation";
    
        container.appendChild(title);
    
        for (let i = 0; i < Object.keys(recipeData.preparation).length; i++) {
            const preparationStep = document.createElement("h3");
            preparationStep.innerHTML = Object.keys(recipeData.preparation)[i];
    
            const preparationDetails = document.createElement("p");
            preparationDetails.innerHTML = Object.values(recipeData.preparation)[i];
            
            container.appendChild(preparationStep);
            container.appendChild(preparationDetails);
        };
        return container;
    };
    
    const recipeDisplayContainer = document.createElement("div");
    recipeDisplayContainer.appendChild(createRecipeTitle(recipeData));
    recipeDisplayContainer.appendChild(createRecipeOverviewData(recipeData));
    recipeDisplayContainer.appendChild(createRecipeImage(recipeData));
    recipeDisplayContainer.appendChild(createRecipeShortDescription(recipeData));
    recipeDisplayContainer.appendChild(createNutritionFacts(recipeData));
    recipeDisplayContainer.appendChild(createIngredientsSection(recipeData));
    recipeDisplayContainer.appendChild(createStockSection(recipeData));
    recipeDisplayContainer.appendChild(createPreparationSection(recipeData));

    return recipeDisplayContainer;
};

//move the font awsome icons before the content
//bug: if generate button is pressed multiple times, it will still generate buttons
//bug: if add to list button is pressed multiple times when an error is generated, it will still generate errors