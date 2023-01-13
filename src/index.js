import "./css/styles.css";
import { fetchСountries } from "./fetchCountries";
import debounce from "lodash.debounce";
import { Notify } from "notiflix/build/notiflix-notify-aio";

const DEBOUNCE_DELAY = 300;

//  Создаем рефы  //

const refs = {
  formBox: document.querySelector(`#search-box`),
  countryList: document.querySelector(`.country-list`),
  countryInfo: document.querySelector(`.country-info`),
};

//  Вешаем слушателя на форму  //

refs.formBox.addEventListener("input", debounce(search, DEBOUNCE_DELAY));
console.log(refs.formBox);

function search(e) {
  e.preventDefault();
  const nameCountry = refs.formBox.value.trim();
  clearContainer();
  if (nameCountry)
    fetchСountries(nameCountry).then((data) => searchCountry(data));
}

//  Создаем функцию поиска  //

function searchCountry(countries) {
  if (countries.length > 10) {
    Notify.success(
      "Too many matches found. Please enter a more specific name."
    );
  } else if (countries.length >= 2 && countries.length < 10) {
    renderCountryList(countries);
  } else if (countries.length === 1) {
    renderCountryCard(countries);
  } else {
    clearError(countries);
  }
}

function renderCountryCard(countries) {
  const cardMarkup = countries
    .map(({ name, capital, population, flags, languages }) => {
      return `<div class = "country-list_item">
        <div class = "country-list_title">
        <img src="${flags.svg}" style="width: 40px; height: 40px"/>
        <h2>${name}</h2>
        </div>
        <p><strong>Capital:</strong> ${capital}</p>
        <p><strong>Population:</strong> ${population}</p>
        <p><strong>Languages:</strong>
        ${languages.map((lang) => lang.name)}</p>
        </div>`;
    })
    .join("");
  console.log(refs.countryList);
  refs.countryInfo.insertAdjacentHTML("beforeend", cardMarkup);
  console.log(cardMarkup);
}
function renderCountryList(countries) {
  const markup = countries
    .map(({ name, flags }) => {
      return `<li class="country-list__item">
        <img src=${flags.svg}  style="width:40px;height:40px"/>
         <h2>${name}</h2>
        </li>`;
    })
    .join("");

  refs.countryList.insertAdjacentHTML("beforeend", markup);
}
function clearError(countries) {
  if (countries.length === 0) {
    throw new Error("404");
  } else {
    Notify.failure("Oops, there is no country with that name");
  }
}
function clearContainer() {
  refs.countryList.innerHTML = "";
  refs.countryInfo.innerHTML = "";
}
