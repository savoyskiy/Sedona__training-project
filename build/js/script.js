let header=document.querySelector(".header"),navigationList=document.querySelector(".navigation__list"),navigationMenuButton=document.querySelector(".navigation__menu-button");header.classList.remove("header--no-js"),navigationList.classList.remove("navigation__list--no-js"),navigationMenuButton.classList.remove("navigation__menu-button--no-js"),navigationMenuButton.onclick=function(){navigationMenuButton.classList.toggle("navigation__menu-button--close"),navigationMenuButton.classList.toggle("navigation__menu-button--open"),navigationList.classList.toggle("navigation__list--hidden"),navigationList.classList.toggle("navigation__list--open")};