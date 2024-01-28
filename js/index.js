import { Validation } from "./validation.js";

const apiBaseURL = "https://www.themealdb.com/api/json/v1/1";

class Yummy {
  constructor() {
    this.validation = new Validation();
    this.setupEventListeners();
    this.displayHomeData();
  }

  setupEventListeners() {
    $(".sidebar-menu-icons").on("click", () => this.toggleSidebar());
    $(document).on("click", ".categoryItem", (event) =>
      this.handleCardClick(event, "category-meals")
    );
    $(document).on("click", ".card", (event) =>
      this.handleCardClick(event, "details")
    );
    $(document).on("click", ".item", (event) =>
      this.handleCardClick(event, "area-meals")
    );
    $(document).on("click", ".ingredientsItem", (event) =>
      this.handleCardClick(event, "ingredients-meals")
    );

    $(document).on("click", ".search", () => this.toggleSection("search"));
    $(document).on("click", ".categories", () =>
      this.toggleSection("categories")
    );
    $(document).on("click", ".area", () => this.toggleSection("area"));
    $(document).on("click", ".ingredients", () =>
      this.toggleSection("ingredients")
    );
    $(document).on("click", ".contact", () => this.toggleSection("contact"));

    $(document).on("keyup", "#searchName", () =>
      this.handleSearchInput("#searchName")
    );
    $(document).on("keyup", "#searchLetter", () =>
      this.handleSearchInput("#searchLetter")
    );
  }

  async handleCardClick(event, section) {
    const id = $(event.currentTarget).attr("id");
    $("section, header").addClass("d-none");
    await this.loadSection(section);
    switch (section) {
      case "details":
        await this.displayDetailsData(id);
        break;
      case "category-meals":
        await this.displayCategoryMealsData(id);
        break;
      case "area-meals":
        await this.displayAreaMealsData(id);
        break;
      case "ingredients-meals":
        await this.displayIngredientsMealsData(id);
        break;
    }
  }

  async toggleSection(section) {
    $("section, header").addClass("d-none");
    await this.loadSection(section);
    switch (section) {
      case "area":
        await this.displayAreaList();
        break;
      case "ingredients":
        await this.displayIngredientsList();
        break;
      case "categories":
        await this.displayCategoriesList();
        break;
      case "contact":
        break;
    }
  }

  async getListAPI(endpoint, type) {
    this.toggleLoading();
    const api = await fetch(`${apiBaseURL}/${endpoint}`);
    const response = await api.json();
    this.toggleLoading();
    return type === "categories" ? response[type] : response.meals.slice(0, 20);
  }

  async displayHomeData() {
    const data = await this.getListAPI(`search.php?s=`, "meals");
    const cartona = this.generateCardHtml(data);
    $("#homeData").html(cartona);
  }

  async searchAPI(query, type) {
    this.searchLoading();
    const api = await fetch(`${apiBaseURL}/search.php?${type}=${query}`);
    const response = await api.json();
    this.searchLoading();
    return response.meals.slice(0, 20);
  }

  async displaySearchLetter(letter) {
    const data = await this.searchAPI(letter, "f");
    const cardHtml = this.generateCardHtml(data);
    $("#searchData").html(cardHtml);
  }

  async displaySearchData(name) {
    const data = await this.searchAPI(name, "s");
    const cardHtml = this.generateCardHtml(data);
    $("#searchData").html(cardHtml);
  }

  async handleSearchInput(inputId) {
    const value = $(inputId).val();
    await this.displaySearchData(value);
  }

  async displayCategoriesList() {
    const data = await this.getListAPI("categories.php", "categories");
    let cartona = ``;
    for (let i = 0; i < data.length; i++) {
      cartona += `<div class="col-md-3">
                               <div class="categoryItem border-0 bg-transparent text-center position-relative overflow-hidden" id="${
                                 data[i].strCategory
                               }">
                                <img src=${
                                  data[i].strCategoryThumb
                                } class="rounded" alt="${data[i].strCategory}">
                                <div class="card-body position-absolute top-100 w-100 h-100 d-flex align-items-center rounded flex-column">
                                    <h3>${data[i].strCategory}</h3>
                                    <p>${data[i].strCategoryDescription
                                      .split(" ")
                                      .slice(0, 20)
                                      .join(" ")}</p>
                                </div>
                            </div>
                        </div>`;
    }
    $("#categoriesData").html(cartona);
  }

  async displayCategoryMealsData(category) {
    const data = await this.getListAPI(`filter.php?c=${category}`, "meals");
    const cartona = this.generateCardHtml(data);
    $("#categoryMealsData").html(cartona);
  }

  async displayAreaList() {
    const data = await this.getListAPI("list.php?a=list", "meals");
    let cartona = ``;
    for (let i = 0; i < data.length; i++) {
      cartona += `<div class="col-md-3">
                            <div class="item text-center bg-transparent" id='${data[i].strArea}'>
                                <i class="fa-solid fa-house-laptop"></i>
                                <h3>${data[i].strArea}</h3>
                            </div>
                        </div>`;
    }
    $("#areaData").html(cartona);
  }

  async displayAreaMealsData(area) {
    const data = await this.getListAPI(`filter.php?a=${area}`, "meals");
    const cartona = this.generateCardHtml(data);
    $("#areaMealsData").html(cartona);
  }

  async displayIngredientsList() {
    const data = await this.getListAPI("list.php?i=list", "meals");
    let cartona = ``;
    for (let i = 0; i < data.length; i++) {
      cartona += `<div class="col-md-3">
                            <div class="ingredientsItem text-center" id='${
                              data[i].strIngredient
                            }'>
                                <i class="fa-solid fa-drumstick-bite"></i>
                                <h3>${data[i].strIngredient}</h3>
                                <p>${data[i].strDescription
                                  .split(" ")
                                  .slice(0, 20)
                                  .join(" ")}</p>
                            </div>
                        </div>`;
    }
    $("#ingredientsData").html(cartona);
  }

  async displayIngredientsMealsData(id) {
    const data = await this.getListAPI(`filter.php?i=${id}`, "meals");
    const cartona = this.generateCardHtml(data);
    $("#ingredientsMealsData").html(cartona);
  }

  generateIngredientsList(data) {
    let ingredientsList = "";
    for (let i = 1; i <= 20; i++) {
      const ingredient = data[`strIngredient${i}`];
      const measure = data[`strMeasure${i}`];
      if (ingredient && ingredient.trim() !== "") {
        ingredientsList += `<li>${
          measure ? `${measure} ` : ""
        }${ingredient}</li>`;
      }
    }
    return ingredientsList;
  }

  generateTagsList(data) {
    let tagsList = "";
    if (data.strTags) {
      const tagsArray = data.strTags.split(",");
      tagsArray.forEach((tag) => {
        tagsList += `<li>${tag.trim()}</li>`;
      });
    }
    return tagsList;
  }

  async displayDetailsData(id) {
    const allData = await this.getListAPI(`lookup.php?i=${id}`, "meals");
    const data = allData[0];
    const ingredientsList = this.generateIngredientsList(data);
    const tagsList = this.generateTagsList(data);

    const cartona = `
          <div class="col-md-4">
            <div class="image">
              <img src=${data.strMealThumb} alt="${data.strMeal}" class="w-100 rounded" />
              <h2>${data.strMeal}</h2>
            </div>
          </div>
          <div class="col-md-8">
            <div class="content">
              <h2>Instructions</h2>
              <p>${data.strInstructions}</p>
              <h3><span>Area :</span>${data.strArea}</h3>
              <h3><span>Category :</span>${data.strCategory}</h3>
              <h3>Recipes :</h3>
              <ul class="recipes-list list-unstyled d-flex flex-wrap">
                ${ingredientsList}
              </ul>
              <h3>Tags :</h3>
              <ul class="tags-list list-unstyled d-flex flex-wrap">
                ${tagsList}
              </ul>
              <a href=${data.strSource} class="btn btn-success">Source</a>
              <a href=${data.strYoutube} class="btn btn-danger">Youtube</a>
            </div>
          </div>`;

    $("#detailsData").html(cartona);
  }

  generateCardHtml(data) {
    return data
      .map(
        (item) => `
            <div class="col-md-3">
            <div class="card border-0 position-relative overflow-hidden" id="${item.idMeal}">
                <img src=${item.strMealThumb} class="rounded" alt="${item.strMeal}">
                <div class="card-body position-absolute top-100 w-100 h-100 d-flex align-items-center rounded">
                <h3 class="text-capitalize">${item.strMeal}</h3>
                </div>
            </div>
            </div>`
      )
      .join("");
  }

  toggleLoading() {
    $(".loading").toggleClass("d-none");
  }

  searchLoading() {
    $(".loading").toggleClass("searchloading");
    $(".loading").toggleClass("d-none");
  }

  async toggleSidebar() {
    const navWidth = $(".sidebar-menu-section").innerWidth();
    const navLeft = $(".sidebar-menu-section").offset().left;

    if (navLeft == 0) {
      $(".side-nav").animate({ left: -navWidth }, 500);
      $(".fa-bars, .fa-xmark").toggleClass("d-none");
      $(".sidebar-menu-section").removeClass("opened");
    } else {
      $(".side-nav").animate({ left: 0 }, 500);
      $(".fa-bars, .fa-xmark").toggleClass("d-none");
      $(".sidebar-menu-section").addClass("opened");
    }
  }

  async loadSection(section) {
    const navWidth = $(".sidebar-menu-section").innerWidth();
    const navLeft = $(".sidebar-menu-section").offset().left;

    if (navLeft == 0) {
      $(".side-nav").animate({ left: -navWidth }, 500);
      $(".fa-bars, .fa-xmark").toggleClass("d-none");
      $(".sidebar-menu-section").removeClass("opened");
    }

    $(`#${section}`).removeClass("d-none");
  }
}

$(document).ready(function () {
  new Yummy();
});
